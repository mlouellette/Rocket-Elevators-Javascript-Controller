
let elevatorID = 1
let floorRequestButtonID = 1
let callButtonID = 1
class Column {
    constructor(_id, _status, _amountOfFloors, _amountOfElevators) {
        this.id = _id;
        this.status = _status;
        this.elevatorList = [];
        this.callButtonList = [];

        this.createElevators(_amountOfFloors, _amountOfElevators)
        this.createCallButtons(_amountOfFloors)

    };

    createCallButtons(_amountOfFloors) {
       
       for (let buttonFloor = 1 in _amountOfFloors) {

        if (buttonFloor < _amountOfFloors) {
         let callButton = New CallButton(callButtonID, OFF, buttonFloor, buttonFloor)
         this.callButtonList.push(callButton);
         callButtonID++;

        }

        if (buttonFloor > 1) {
         let callButton = New CallButton(callButtonID, OFF, buttonFloor, Down);
         this.callButtonList.push(callButton);
         callButtonID++;

        }

        buttonFloor++;

      }
    }

    createElevators(_amountOfFloors, _amountOfElevators) {
        for (let elevator in _amountOfElevators) {
            elevator = New Elevator(elevatorID, idle, _amountOfFloors, 1)
            this.elevatorList.push(elevator);
            elevatorID++;

        }

    }

    requestElevator(floor, direction, elevator) {
        let elevator = this.findElevator(floor, direction, elevator);
        requestList.push(elevator);
        elevator(move);
        elevator(operateDoors);
        return elevator;

    }

    findElevator(requestedFloor, requestedDirection, bestElevator) {
        let bestElevator;
        let bestScore = 5;
        let referenceGap = 10000000;
        let bestElevatorInformations;
        for (elevator in this.elevatorsList) {
            if (requestedFloor === Elevator.currentFloor && Elevator.status === stopped && requestedDirection === Elevator.direction) {
                let bestElevatorInformations = this.checkIfElevatorIsBetter(1, elevator, bestScore, referenceGap, bestElevator, requestedFloor, bestElevatorInformations);

            } else if (requestedFloor > Elevator.currentFloor && Elevator.direction === Up && requestedDirection === Elevator.direction) {
                let bestElevatorInformations = this.checkIfElevatorisBetter(2, elevator, bestScore, referenceGap. bestElevator, requestedFloor, bestElevatorInformations);

            } else if (requestedFloor < Elevator.currentFloor && Elevator.direction === down && requestedDirection === Elevator.direction) {
                let bestElevatorInformations = this.checkIfElevatorisBetter(2, elevator, bestScore, referenceGap. bestElevator, requestedFloor, bestElevatorInformations);

            } else if (Elevator.status === idle) {
                let bestElevatorInformations = this.checkIfElevatorisBetter(3, elevator, bestScore, referenceGap. bestElevator, requestedFloor, bestElevatorInformations);
            } else {
                let bestElevatorInformations = this.checkIfElevatorisBetter(4, elevator, bestScore, referenceGap. bestElevator, requestedFloor, bestElevatorInformations);
            }
            let bestElevator = bestElevatorInformations.bestElevator;
            let bestScore = bestElevatorInformations.bestScore;
            let referenceGap = bestElevatorInformations.referenceGap;

        }
        return bestElevator;

    }

    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor, bestElevatorInformations) {
        if (scoreToCheck < bestScore) {
            let bestScore = scoreToCheck;
            let bestElevator = newElevator;
            let referenceGap = newElevator.currentFloor - floor; //a verifier ABSOLUTE VALUE?

        } else if (bestScore === scoreToCheck) {
            let gap = newElevator.currentFloor - floor;
            if (referenceGap > gap) {
                bestElevator = newElevator;
                referenceGap = gap;

            }
        }
        return bestElevator && bestScore && referenceGap.bestElevatorInformations // a verifier AS ?
        
    }
  
}

class Elevator {
    constructor(_id, _status, _amountOfFloors, _currentFloor) {
        this.id = _id;
        this.status = _status;
        this. currentFloor = _currentFloor;
        this.direction = null;
        this.door = new Door(_id, closed);
        this.floorRequestButtonList = [];
        this.floorRequestList = [];

        this.createFloorRequestButtons(_amountOfFloors)

    }

    createFloorRequestButtons(_amountOfFloors) {
        for (let buttonFloor = 1 in _amountOfFloors) {
            let floorRequestButton = new FloorRequestButton(floorRequestButtonID, OFF, buttonFloor)
            this.floorButtonsList.push(floorRequestButton);
            buttonFloor ++
            floorRequestButtonId++

        }

    }

    requestFloor(floor) {
        this.requestList.push(floor);
        this.move();
        this.operateDoors();

    }

    move() {
        while (this.requestList != []) {
            let destination = this.requestList[0];
            this.status = moving;
            if (this.currentFloor < destination) {
                this.direction = up;
                this.sortFloorList();
                while (this.currentFloor < destination) {
                    this.currentFloor++
                    this.screenDisplay = this.currentFloor;

                }
            } else if (this.currentFloor > destination) {
                this.direction = down;
                this.sortFloorList();
                while (this.currentFloor > destination) {
                    this.currentFloor--;
                    this.screenDisplay = this.currentFloor;

                }
            }
            this.status = stopped;
            this.requestList.shift()// removes the first element of an array

        }
        this.status = idle;

    }

    sortFloorList() {
        if (this.direction === up) {
            this.requestList.sort();

        } else {
            this.requestList.reverse();

        }
    }

    operateDoors() {
        this.door.status = opened;
        setTimeout(5000);
        if (this.door.status != overweight) {
            this.door.status = closing;
            if (!obstruction) {
                this.door.status = closed;

            } else {
                this.operateDoors;

            }
            
        } else {
            while (this === overweight) {
                alert("OVERWEIGHT!")

            }
            this.operateDoors();

        }

    }



}

class CallButton {
    constructor(_id, _status, _floor, _direction) {
        this.id = _id;
        this.status = _status;
        this.floor = _floor;
        this.direction = _direction;

    }
}

class FloorRequestButton {
    constructor(_id, _status, _floor) {
        this.id = _id;
        this.status = _status;
        this.floor = _floor;

    }
}

class Door {
    constructor(_id, _status) {
        this.id = _id;
        this.status = _status;

    }
}


module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }