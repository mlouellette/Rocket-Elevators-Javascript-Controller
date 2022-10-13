// console.log('ici')
// let elevatorID = 1
// let floorRequestButtonID = 1
// let callButtonID = 1


class Column {
    constructor(_ID, _amountOfFloors, _amountOfElevators) {
        this.ID = _ID;
        this.status = "";
        this.elevatorList = [];
        this.callButtonList = [];

        this.createElevators(_amountOfFloors, _amountOfElevators);
        this.createCallButtons(_amountOfFloors);

        

    };

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

    createElevators(_amountOfFloors, _amountOfElevators) {
        let elevatorID = 1
        for (let i = 0; i < _amountOfElevators; i++) {
            let elevator = new Elevator(elevatorID, "idle", _amountOfFloors, 1)
            this.elevatorList.push(elevator);
            elevatorID++;

        }

    }

    requestElevator(floor, direction) {
        
        let elevator = this.findElevator(floor, direction);
        elevator.floorRequestList.push(floor);
        elevator.move();
        elevator.operateDoors();
        return elevator

    }

    findElevator(requestedFloor, requestedDirection) {
        let bestElevator;
        let bestScore = 5;
        let referenceGap = 10000000;
        let bestElevatorInformations;
        for (let i = 0; i < this.elevatorList.length; i++) {
            let elevator = this.elevatorList[i];
            if (requestedFloor === elevator.currentFloor && elevator.status === "stopped" && requestedDirection === elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(1, elevator, bestScore, referenceGap, bestElevator, requestedFloor);

            } else if (requestedFloor >= elevator.currentFloor && elevator.direction === "Up" && requestedDirection === elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);

            } else if (requestedFloor <= elevator.currentFloor && elevator.direction === "down" && requestedDirection === elevator.direction) {
                bestElevatorInformations = this.checkIfElevatorIsBetter(2, elevator, bestScore, referenceGap, bestElevator, requestedFloor);

            } else if (elevator.status === "idle") {
                bestElevatorInformations = this.checkIfElevatorIsBetter(3, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
            } else {
                bestElevatorInformations = this.checkIfElevatorIsBetter(4, elevator, bestScore, referenceGap, bestElevator, requestedFloor);
            }
            bestElevator = bestElevatorInformations.bestElevator;
            bestScore = bestElevatorInformations.bestScore;
            referenceGap = bestElevatorInformations.referenceGap;

        }
        return bestElevator;

    }

    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor) {
        if (scoreToCheck < bestScore) {
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = newElevator.currentFloor - floor; //a verifier ABSOLUTE VALUE?

        } else if (bestScore === scoreToCheck) {
            let gap = newElevator.currentFloor - floor;
            if (referenceGap > gap) {
                bestElevator = newElevator;
                referenceGap = gap;

            }
        }
        return { bestElevator,
                 bestScore,
                 referenceGap} 
        
    }
  
}

class Elevator {
    constructor(_ID, _amountOfFloors) {
        this.ID = _ID;
        this.status = "";
        this.currentFloor = "";
        this.direction = null;
        this.door = new Door(_ID, "closed");
        this.floorRequestButtonList = [];
        this.floorRequestList = [];
        

        this.createFloorRequestButtons(_amountOfFloors)

    }

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

    requestFloor(floor) {
        this.floorRequestList.push(floor);
        this.move();
        this.operateDoors();

    }

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
            this.floorRequestList.shift()// removes the first element of an array

        }
        this.status = "idle";

    }

    sortFloorList() {
        if (this.direction === "up") {
            this.floorRequestList.sort();

        } else {
            this.floorRequestList.reverse();

        }
    }

    operateDoors() {
        this.door.status = "opened";
        // setTimeout(5000);
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