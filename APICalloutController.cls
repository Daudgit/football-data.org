public class APICalloutController {
    @AuraEnabled(cacheable=true)
    public static string getCompetitionData(){
        try {
            Http h = new Http();

            HttpRequest req = new HttpRequest();
            req.setEndpoint('http://api.football-data.org/v4/competitions/');
            req.setMethod('GET');

            HttpResponse res = h.send(req);

            if(res.getStatusCode()==200){
                return res.getBody();
            }else{
                throw new AuraHandledException('API Error' +res.getStatus());
            }


        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}