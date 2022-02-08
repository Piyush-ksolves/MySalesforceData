({
    packItem : function(component, event, helper) {
      //  component.set("v.item",component.Packed__c=true);
        component.set("v.item.Packed__c",true);
        event.getSource().set("v.disabled","true");
    }   
     
})