public class DisplayObjectDetail
{
    public Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
    
    
    @AuraEnabled
    public static Map<String, String> getObjectNames() 
    {
        List<String> objNames = new List<String>();
        Map<String, String> options = new Map<String, String>();
        Map<String, String> sortOptions = new Map<String, String>();
        sortOptions.put('--None--','--None--');
        for ( Schema.SObjectType o : Schema.getGlobalDescribe().values() )
        {
            Schema.DescribeSObjectResult objResult = o.getDescribe();
            if(objResult.isQueryable() && objResult.isAccessible()){
                options.put(objResult.getLabel(),objResult.getName());
                //objResult.getName() == API Name
            }
        } 
        objNames.addAll(options.keySet());
        objNames.sort();
        for(String str : objNames){
            sortOptions.put(options.get(str),str);
        }
        //objNames.sort();
        return sortOptions;
    }
    
    @AuraEnabled
    public static List<fieldDataWrapper> getObjectFields(String selectedObject) 
    {
        List<String> fields = new List<String>();
        List<fieldDataWrapper> wrapperList =  new List<fieldDataWrapper>();
        Map<String , Schema.SObjectType> globalDescription = Schema.getGlobalDescribe();
        Schema.sObjectType objType = globalDescription.get(selectedObject); 
        Schema.DescribeSObjectResult r1 = objType.getDescribe(); 
        
        Map<String , Schema.SObjectField> mapFieldList = r1.fields.getMap();  
        
        for(Schema.SObjectField field : mapFieldList.values())  {  
            Schema.DescribeFieldResult fieldResult = field.getDescribe();  
            
            if(fieldResult.isAccessible())  {  
                fields.add(fieldResult.getName());
                fieldDataWrapper wrapper = new fieldDataWrapper();
                wrapper.label = field.getDescribe().getLabel();
                wrapper.apiName = field.getDescribe().getName();
                wrapperList.add(wrapper);
            } 
                       
        }
        System.debug('wrapperList.size() === >'+wrapperList.size());
        System.debug('label ===>'+wrapperList);
        return wrapperList;
    }
    
    @AuraEnabled
    public static DynamicBindingWrapper getExecuteQury(String query, List<String> apiNames){
        DynamicBindingWrapper dynamicData = new DynamicBindingWrapper();
        	
        	List<sObject> sobjList = new List<sObject>();
        
            sobjList = Database.query(query); 
            if(sobjList!=null && sobjList.size()>0){
                dynamicData.sObjectData = sobjList;
            }
            else{
                dynamicData.sObjectData = new List<sObject>();
            }
            dynamicData.fieldList = apiNames;
        
            //System.debug('wrapperList'+wrapperList);
            //dynamicData.fieldList = wrapperList;
            
            
            System.debug('sobjList == '+sobjList);
            return dynamicData;
        
       
        
    }
    
    
    //Class to store the dynamic data and list of related fields
    public class DynamicBindingWrapper{
        @AuraEnabled
        public List<sObject> sObjectData {get; set;}
        @AuraEnabled
        public List<String> fieldList {get; set;}
    }
    
    //Class to store the field information
    
    public class fieldDataWrapper{
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public String apiName {get; set;}
    }
}