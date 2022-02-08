({
    doInit: function(component, event, helper) {        
        helper.getPicklistValues(component, event);
    },
    
    handleOnChange : function(component, event, helper) {
        var myValues= component.get("v.objectMap"), 
            value = component.find("objectPicklist").get("v.value"),
            index = myValues.findIndex(item => item.key == value),
            selectedName = index >= 0? myValues[index].value: null;
        component.set("v.objectApiname",value);
        component.set("v.SelectedObject", selectedName);
        component.set("v.selectedGenreList", []);
        component.set("v.queryDisplay","");
        if(value == '--None--'){
            component.set("v.GenreList",[]);
            component.set("v.showMultiPicklist",'');
        }else{
            component.set("v.showMultiPicklist",'True');
            helper.getFieldsValue(component, event,helper);
        }
    },
    
    handleFieldsChange: function (component, event, helper) {
        //Get the Selected values   
        var selectedValues = event.getParam("value");
        console.log('selectedValues ==>'+selectedValues);
        
        //Update the Selected Values  
        component.set("v.selectedGenreList", selectedValues);
        helper.getQuery(component, event,helper);
    },
    
    handleChangeQuery: function (component, event, helper){
        console.log('query ==> '+component.get("v.queryDisplay"));
    },
    /*
    getExecuteQuery : function(component, event, helper){
        //Get selected Genre List on button click 
        console.log('WHEN BUTTON CLICK');
        helper.getResult(component, event,helper);
    }*/
    getExecuteQuery : function(component, event, helper){
        //Get selected Genre List on button click 
        console.log('WHEN BUTTON CLICK');
        helper.getResult(component, event,helper);
    },
    
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for displaying loading spinner 
        component.set("v.spinner", true); 
    },
    
    // function automatic called by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){
        // make Spinner attribute to false for hiding loading spinner    
        component.set("v.spinner", false);
    }
	
})