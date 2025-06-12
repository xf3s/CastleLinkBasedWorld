class Start extends Scene {
    create() {
        // use the Title from the story data file
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        // go to the initial location specified in the story data
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        // get the data for the current location
        let locationData = this.engine.storyData.Locations[key];
        
        // check for location state to display alternate body text
        if (locationData.StateProperty && this.engine.state[locationData.StateProperty]) {
            this.engine.show(locationData.Body_State);
        } else {
            this.engine.show(locationData.Body);
        }

        // check if the location has choices
        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                // check if a choice requires an item that the player doesn't have
                if (choice.requires && !this.engine.inventory.includes(choice.requires)) {
                    continue;
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }
    
    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);

            // if the choice gives an item, add it to inventory
            if (choice.gives) {
                this.engine.inventory.push(choice.gives);
            }
            
            // if the choice removes an item, remove it from inventory
            if (choice.removes) {
                this.engine.inventory = this.engine.inventory.filter(item => item !== choice.removes);
            }

            // if the choice sets a state variable, set it
            if (choice.setsState) {
                this.engine.state[choice.setsState] = true;
            }

            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');