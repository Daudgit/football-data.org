import { LightningElement } from 'lwc';
import getCompetitionData from '@salesforce/apex/APICalloutController.getCompetitionData';

export default class ShowMatchData extends LightningElement {
    competitions = [];
    areas = [];
    selectedArea;
    selectedType;
    filteredCompetitions = [];
    isLoading = false;
    isSubmitted = false;
    isDataFetched = false;
    areaOptions;
    typeOption;


    get dataStatusText() {
        return this.isDataFetched ? 'Fetched' : 'Not Fetched';
    }
    
    get dataStatusClass() {
        return this.isDataFetched ? 'slds-text-color_success' : 'slds-text-color_error';
    }

    connectedCallback() {
        this.fetchCompetitionData();
    }

    fetchCompetitionData(){
        this.isLoading = true;
        getCompetitionData()
        .then(result => {
            const parsedData = JSON.parse(result).competitions;
            this.competitions = parsedData;
            this.isDataFetched = true;
            this.areaOptions = [...new Set(parsedData.map(c => c.area.name))].map(name => ({
                label: name,
                value: name
            }));
            this.typeOption = [...new Set(parsedData.map(c => c.type))].map(type => ({
                label: type,
                value: type
            }));
        })
        .catch(error => {
            console.error('Error fetching data', error);
            this.isDataFetched = false;
        })
        .finally(() => {
            this.isLoading = false;
        });
    }

    handleAreaChange(event) {
        this.selectedArea = event.target.value;
        console.log('Selected Area:', this.selectedArea);
    }


    handleTypeChange(event){
        this.selectedType = event.target.value;
        console.log('Selected Type:', this.selectedType);
    }

    handleClick() {
        this.isLoading = true;
        this.isSubmitted = true;
    
        // Filter logic
        this.filteredCompetitions = this.competitions.filter(
            comp => comp.area?.name === this.selectedArea && comp.type === this.selectedType && comp.currentSeason?.startDate !=null && comp.currentSeason?.endDate !=null 
        );
    
        this.isLoading = false;
    }

}
