class Column {
    constructor(_ID, _amountOfFloors, _amountOfElevators) {
        this.ID = _ID;
        this.status = "";
        this.elevatorList = [];
        this.callButtonList = [];

        this.createElevators(_amountOfFloors, _amountOfElevators);
        this.createCallButtons(_amountOfFloors);

    };

    //Button press function, Up or Down
    createCallButtons(_amountOfFloors) {
       let callButtonID = 1
       let buttonFloor = 1;
       for (let i = 0; i < _amountOfFloors; i++) {

        if (buttonFloor < _amountOfFloors) {
         let callButton = new CallButton(callButtonID, "OFF", buttonFloor, "Up");
         this.callButtonList.push(callButton);
         callButtonID++;

        }

        if (buttonFloor > 1) {
         let callButton = new CallButton(callButtonID, "OFF", buttonFloor, "Down");
         this.callButtonList.push(callButton);
         callButtonID++;

        }

        buttonFloor++;

      }
    }
    
    //Create Elevator function for the different scenarios
    createElevators(_amountOfFloors, _amountOfElevators) {
        let elevatorID = 1
        for (let i = 0; i < _amountOfElevators; i++) {
            let elevator = new Elevator(elevatorID, "idle", _amountOfFloors, 1)
            this.elevatorList.push(elevator);
            elevatorID++;

        }
    }

    //Simulate when a user press a button outside the elevator. Push the demand into a list.
    requestElevator(floor, direction) {
        let elevator = this.findElevator(floor, direction);
        elevator.floorRequestList.push(floor);
        elevator.move();
        elevator.operateDoors();
        return elevator

    }

    //We use a score system depending on the current elevators state. Since the bestScore and the referenceGap are 
    //higher values than what could be possibly calculated, the first elevator will always become the default bestElevator, 
    //before being compared with to other elevators. If two elevators get the same score, the nearest one is prioritized.
    findElevator(requestedFloor, requestedDirection) {
        let bestElevator;
        let bestScore = 5;
        let referenceGap = 10000000;
        let bestElevatorInformations;
        for (let i = 0; i < this.elevatorList.length; i++) {
            let elevator = this.elevatorList[i];

            //The elevator is at my floor and going in the direction I want
            if (requestedFloor === elevator.currentFloor && elevator.status === "stopped" && requestedDirection === elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(1, elevator, bestScore, referenceGap, bestElevator, requestedFloor);

            //The elevator is lower than me, is coming up and I want to go up
            } else if (requestedFloor > elevator.currentFloor && elevator.direction === "Up" && requestedDirection === elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);

            //The elevator is higher than me, is coming down and I want to go down
            } else if (requestedFloor < elevator.currentFloor && elevator.direction === "down" && requestedDirection === elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);

            //The elevator is idle
            } else if (elevator.status === "idle") {
                bestElevatorInformations = this.checkIfElevatorIsBetter(3, elevator, bestScore, referenceGap, bestElevator, requestedFloor);

            //The elevator is not available, but still could take the call if nothing better is found    
            } else {
                bestElevatorInformations = this.checkIfElevatorIsBetter(4, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
            }
            bestElevator = bestElevatorInformations.bestElevator;
            bestScore = bestElevatorInformations.bestScore;
            referenceGap = bestElevatorInformations.referenceGap;

        }
        return bestElevator;

    }
    
    //Select the closest/best elevator to do the scenario
    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor) {
        if (scoreToCheck < bestScore) {
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = Math.abs(newElevator.currentFloor - floor);

        } else if (bestScore === scoreToCheck) {
            let gap = Math.abs(newElevator.currentFloor - floor);
            if (referenceGap > gap) {
                bestElevator = newElevator;
                referenceGap = gap;

            }
        }
        return { bestElevator,
                 bestScore,
                 referenceGap}; 
        
    }
}

class Elevator {
    constructor(_ID, _amountOfFloors) {
        this.ID = _ID;
        this.status = "";
        this.currentFloor = 1
        this.direction = null;
        this.door = new Door(_ID, "closed");
        this.floorRequestButtonList = [];
        this.floorRequestList = [];

        this.createFloorRequestButtons(_amountOfFloors)

    }

    //Push the request demands in lists 
    createFloorRequestButtons(_amountOfFloors) {
        let floorRequestButtonID = 1
        let buttonFloor = 1
        for (let i = 0; i < _amountOfFloors; i++) {
            let floorRequestButton = new FloorRequestButton(floorRequestButtonID, "OFF", buttonFloor)
            this.floorRequestButtonList.push(floorRequestButton);
            buttonFloor++
            floorRequestButtonID++

        }
    }

    //Simulate when a user press a button inside the elevator
    requestFloor(floor) {
        this.floorRequestList.push(floor);
        this.move();
        this.operateDoors();

    }

    //Move elevator to the direction based on what floor we are currently
    move() {
        while (this.floorRequestList != 0) {
            let destination = this.floorRequestList[0];
            this.status = "moving";
            if (this.currentFloor < destination) {
                this.direction = "up";
                this.sortFloorList();
                while (this.currentFloor < destination) {
                    this.currentFloor++
                    this.screenDisplay = this.currentFloor;

                }
            } else if (this.currentFloor >= destination) {
                this.direction = "down";
                this.sortFloorList();
                while (this.currentFloor > destination) {
                    this.currentFloor--;
                    this.screenDisplay = this.currentFloor;

                }
            }
            this.status = "stopped";
            this.floorRequestList.shift()

        }
        this.status = "idle";

    }

    //Sort list function to pick up other requests mid destination
    sortFloorList() {
        if (this.direction === "up") {
            this.floorRequestList.sort();

        } else {
            this.floorRequestList.reverse();

        }
    }

    //Alert preventing doors obstructions and overweight oad in the elevator
    operateDoors() {
        this.door.status = "opened";
        
        if (this.door.status != "overweight") {
            this.door.status = "closing";
            if (this != "Obstruction") {
                this.door.status = "closed";

            } else {
                this.operateDoors;

            }
            
        } else {
            while (this === "overweight") {
                alert("OVERWEIGHT!")

            }
            this.operateDoors();
        }
    }
}

class CallButton {
    constructor(_ID, _floor, _direction) {
        this.ID = _ID;
        this.status = "";
        this.floor = _floor;
        this.direction = _direction;

    }
}

class FloorRequestButton {
    constructor(_ID, _floor ){
        this.ID = _ID;
        this.status = "";
        this.floor = _floor;

    }
}

class Door {
    constructor(_ID) {
        this.ID = _ID;
        this.status = "";

    }
}

module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door}
