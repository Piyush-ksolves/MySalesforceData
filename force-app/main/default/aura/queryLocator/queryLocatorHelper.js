({
    getPicklistValues: function(component, event) {
        var action = component.get("c.getObjectNames");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var fieldMap = [];
                for(var key in result){
                    fieldMap.push({key: key, value: result[key]});
                }
                component.set("v.objectMap", fieldMap);
            }
        });
        $A.enqueueAction(action);
    },
    
    getFieldsValue: function(component, event,helper, value) {
        var action = component.get("c.getObjectFields");
        console.log('Action Inside getFieldsValue');
        action.setParams({selectedObject: component.get("v.objectApiname")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Success Action Inside getFieldsValue');
                var result = response.getReturnValue();
                var fieldValues = [];
                // Create table Header
                for (var i=0; i<result.length; i++) {
                    //fieldValues.push(result[i].label);
                    //fieldNames.push(result[i].apiName);
                    fieldValues.push({
                        label: result[i].label,
                        value: result[i].apiName
                    });
                    
                }
                component.set("v.GenreList", fieldValues);
                
            }
            
        });
        $A.enqueueAction(action); 
    },
    
    getQuery : function(component, event,helper){
        var str = component.get("v.selectedGenreList");
        var objName = component.get("v.objectApiname");
        var qry = 'SELECT ';
        if(str.length > 0){
            qry = qry + str;
            qry = qry + ' from ' + objName;
            component.set("v.queryDisplay",qry);
        }
        //var textarea = cmp.find("mytextarea");
        
    },
    
    getResult : function(component, event,helper){
        console.log('INSIDE HELPER GETRESULT');
        var query = component.get("v.queryDisplay");
        var apiName = component.get("v.selectedGenreList");
        var action = component.get("c.getExecuteQury");
        action.setParams({query: component.get("v.queryDisplay"),
                          apiNames: component.get("v.selectedGenreList")
                         });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log("Pg success");
                component.set("v.showError","");
                var allValues = response.getReturnValue();
                console.log('allValues--->' + allValues);
                var objectValue = allValues.sObjectData;
                console.log('objectValue--->' + objectValue);
                var fieldList = allValues.fieldList;
                console.log('fieldList--->' + fieldList);
                
                // Create Dynamic Table 
                var sObjectDataTableHeader = [];
                // Create table Header
                console.log('Above for loop table header');
                for (var i=0; i<fieldList.length; i++) {
                    console.log('Inside for loop table header');
                    sObjectDataTableHeader.push(fieldList[i]);
                }
                console.log('sObjectDataTableHeader--->>' + sObjectDataTableHeader);
                //Get the count of columns.
                console.log('sObjectDataTableHeader.length ==>'+sObjectDataTableHeader.length);
                var columnCount = sObjectDataTableHeader.length;
                //Create a HTML Table element.
                var table = document.createElement("TABLE");
                //table.border='2';
                //Add the header row.
                var row = table.insertRow(-1);
                for (var i=0; i<columnCount; i++) {
                    console.log('Inside another loop columnCount row val=='+row);
                    var headerCell = document.createElement("TH");
                    //headerCell.width='75';
                    headerCell.innerHTML = sObjectDataTableHeader[i];
                    headerCell.className='headerClass';
                    row.appendChild(headerCell);
                }
                console.log('Outside another for loop');
                console.log('after Outside another for loop objectValue.length===>'+objectValue.length);
                var dvTable = document.getElementById("sfdctable");
                dvTable.innerHTML = "";
                dvTable.appendChild(table);
                console.log('above objectValue.length===>'+objectValue.length);
                // Create Dynamic Table End    
                if(objectValue.length){
                    console.log('Inside objectValue If Conditon');
                    for(var j=0; j<objectValue.length; j++){
                        // Dynamic table Row
                        row = table.insertRow(-1);
                        // Dynamic Table Row End
                        for (var i=0; i<fieldList.length; i++) {
                            // Dynamic table Row
                            var cell = row.insertCell(-1);
                            console.log('Inside another loop for final');
                            //console.log('objectValue[j] == '+objectValue[j][fieldList[i]]);
                            if(objectValue[j][fieldList[i]] === undefined){
                                console.log('Inside If above');
                                cell.innerHTML = "";
                                console.log('Inside If');
                            }else{
                                console.log('Inside else above');
                                cell.innerHTML = objectValue[j][fieldList[i]];
                                console.log('Inside else');
                                     
                            }
                            
                        }
                    }
                }
            }        	         
            else if (state === "ERROR") {
                var errors = response.getError();
                console.log("Inside error");
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                        component.set("v.errorMessage","Please check your query");
                        component.set("v.showError","True");
                    }
                } 
                else {
                    console.log("Unknown Error");
                }
            }
        });
        $A.enqueueAction(action);
    }
})