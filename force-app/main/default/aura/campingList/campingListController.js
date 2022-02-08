({
    clickCreateItem : function(component, event, helper) {
        
        let validCampaign = component.find('campingform').reduce(function(validSoFar,inputCmp){
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        },true);
        
        if(validCampaign){
            let newCampaign = component.get("v.newItem");
            var campings = component.get("v.items");
            var item = JSON.parse(JSON.stringify(newCampaign));
            campings.push(item);
            component.set("v.items",campings);
            component.set("v.newItem",{ 'sobjectType': 'Camping_Item__c','Name': '','Quantity__c': 0,
                                       'Price__c': 0,'Packed__c': false });
            //console.log("Create expense: " + JSON.stringify(newCampaign));
            helper.createItem(component, newCampaign);
        }
    },
    doInit: function(component, event, helper) {
        // Create the action
        let action = component.get("c.getItems");
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.items", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    }
})