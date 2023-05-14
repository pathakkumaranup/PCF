import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SIRENEAutoComplete implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private localNotifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    private container: HTMLDivElement;
    private label: HTMLLabelElement;
    private buttonContainer: HTMLDivElement;
    private button: HTMLButtonElement;
    private refreshData: EventListenerOrEventListenerObject;

    // input element that is used to create the autocomplete
    private inputElement: HTMLInputElement;

    // Datalist element.
    private datalistElement: HTMLDataListElement;

    private _phoneNumber: string;
    private _name: string;
    private _email: string;
    private _libelleCodeNAF: string;
    private _formeJuridique: string;
    private _adresse: string;
    private _code_postal: string;
    private _ville: string;
    private id: string;
    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        this.localNotifyOutputChanged = notifyOutputChanged;
        this.context = context;

        // @ts-ignore
        this.id = context.parameters.value.attributes.LogicalName;

        // Assiging enviroment variable.
        this.context = context;
        this.container = document.createElement("div");
        this.container.className = "ms-SearchBox";
        this.container.setAttribute("style", "width:100%");

        this.label = document.createElement("label");
        this.label.className = "ms-SearchBox-label";
        this.label.innerHTML = "<i class='ms-SearchBox-icon ms-Icon ms-Icon--Search'></i>"

        this.buttonContainer = document.createElement("div");
        this.buttonContainer.className = "ms-CommandButton ms-SearchBox-clear ms-CommandButton--noLabel"
        this.buttonContainer.setAttribute("style", "display:block");

        this.button = document.createElement("button");
        this.button.className = "ms-CommandButton-button"
        this.button.innerHTML = '<span class="ms-CommandButton-icon"><i class="ms-Icon ms-Icon--Clear"></i></span><span class="ms-CommandButton-label"></span> '

        this.button.addEventListener("click", this.clearFields.bind(this))

        this.inputElement = document.createElement("input");
        this.inputElement.name = "autocomplete_" + this.id
        this.inputElement.placeholder = "Search Contact Database...";
        this.inputElement.autocomplete = "off";
        this.inputElement.className = "ms-SearchBox-field"
        this.inputElement.setAttribute("list", "list_" + this.id);
        this.inputElement.setAttribute("style", "width:100%");


        // Get initial values from field.
        // @ts-ignore
        this.inputElement.value = this.context.parameters.value.formatted

        // Add an eventlistner the element and bind it to a  function.
        this.inputElement.addEventListener("input", this.getSuggestions.bind(this));

        // creating HTML elements for data list 
        this.datalistElement = document.createElement("datalist");
        this.datalistElement.id = "list_" + this.id;

        var optionsHTML = "";

        //@ts-ignore 
        this.datalistElement.innerHTML = optionsHTML;

        // Appending the HTML elements to the control's HTML container element.
        // Add input element

        this.buttonContainer.appendChild(this.button);
        this.container.appendChild(this.label);
        this.container.appendChild(this.buttonContainer);
        this.container.appendChild(this.inputElement);

        //Add datalist element
        this.container.appendChild(this.datalistElement);
        container.appendChild(this.container);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        ((this._name != undefined) ? this.inputElement.value = this._name : null)
    }

    public clearFields(evt: Event) {
        console.log("Clear Fields")

        this._name = ""
        this._email = ""
        this._phoneNumber = ""
        // this._libelleCodeNAF = ""
        // this._formeJuridique = ""
        // this._adresse = ""
        // this._code_postal = ""
        // this._ville = ""
        this.localNotifyOutputChanged();
    }

    public getSuggestions(evt: Event) {

        // Connect to Suggestion Pappers API and get the suggestions as the user presses keys and update dropdown.
        let input = (this.inputElement.value as any) as string;
        let key = "Name";
        if (input.indexOf(key) == -1 && input.length > 0) {

            var myHeaders = new Headers();
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL29yZzAzOWMwM2E0LmFwaS5jcm0uZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvM2FiNjkxYjYtODJlMS00Y2M3LWJkMDctNzc5MWQ3Njk1M2U2LyIsImlhdCI6MTY4NDA3MDY2NSwibmJmIjoxNjg0MDcwNjY1LCJleHAiOjE2ODQwNzYxMjQsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUE3d1ozM2U0NDZUYkVDS3hXcS9YMDFQa0xjbitoSWE3RVZHZnVvOThRWUIyTFpZQy9nYjhaQ3VRZFNpcVRVamhJIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjUxZjgxNDg5LTEyZWUtNGE5ZS1hYWFlLWEyNTkxZjQ1OTg3ZCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiR3VwdGEiLCJnaXZlbl9uYW1lIjoiU3VtaXQiLCJpcGFkZHIiOiIyMC4xNjkuMjEuMzEiLCJuYW1lIjoiU3VtaXQgR3VwdGEiLCJvaWQiOiIyMmFjYjg5MC00YmI3LTRiMGUtYTJlZi1hNzE0ZGVjMGViMjciLCJwdWlkIjoiMTAwMzIwMDI5MUVBMEFFRCIsInJoIjoiMC5BVVlBdHBHMk91R0N4MHk5QjNlUjEybFQ1Z2NBQUFBQUFBQUF3QUFBQUFBQUFBQ0FBUEUuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiemx3UFJRUldQSllrdFlHb2hQSVI1SG8xY211UHV4c3RzdExDQ2xoSno3VSIsInRpZCI6IjNhYjY5MWI2LTgyZTEtNGNjNy1iZDA3LTc3OTFkNzY5NTNlNiIsInVuaXF1ZV9uYW1lIjoiU3VtaXRAU3VtaXRiMS5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJTdW1pdEBTdW1pdGIxLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6InJEZmJCX0hDdjAyeDVmdjRfcHNkQUEiLCJ2ZXIiOiIxLjAifQ.RFw4mIDHJ0sy_9z_DiZsvikC7pPTJyqJKbWOAoIoaZGjEYwssu7PE_cA14MRvrfmGG0eZvSAW3d-t89DqYXwZTiVNAFw_A59RQ8AInuGEy0vXKjjhva_gckVEwAMesafux9RQqkI9OTceLw0LBjp18nhI-xxVnitYT3OAclt1X02VRKe4KQ_5t7hFU9ZTHCe0cXIEouPG0qmwrYx9roP44JDFe0xI1wKLV7CPeiKEf-fPkVV_fMdjSXX6y4PjZs5tzuOSOpP4oAe1ll0Djr3ELnnwvxBRJpc1Qc7geh3HW0wMLE0OoQuxnUTqomaOxCuHqQcY1NwPxJ3ZHZUtca1YQ");
            myHeaders.append("Cookie", "ARRAffinity=2204d179a18aa70fdd7a3f8e3d215ffa368974248d810e0e10fa27bbca026abe15134d20c556b0b34b9b6ae43ec3f5dcdad61788de889ffc592af7aca85fc1c508DB544AFA6BEB47852420112; ReqClientId=e65f7a53-ca8c-4404-b656-8d915a321283; orgId=146c95ae-0ad4-ed11-aece-000d3a3ac637");
            var raw = JSON.stringify({
                "search": encodeURIComponent(input) + "~",
                "usefuzzy": true,
                "entities": [
                    "contact"
                ]
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw
            };

            fetch("https://org039c03a4.api.crm.dynamics.com/api/search/v1.0/query?entities=[\"contact\"]", requestOptions)
                .then(response => response.text())
                .then(result => {
                    var respBody = JSON.parse(result);
                    console.log(respBody);
                    var optionsHTML = "";
                    var optionsHTMLArray = new Array();
                    for (var i = 0; i < respBody.value.length; i++) {
                        optionsHTMLArray.push('<option value="');
                        optionsHTMLArray.push('Name:' + respBody.value[i].fullname + ", Phone:" + respBody.value[i].telephone1 + ", Email:" + respBody.value[i].emailaddress1);
                        optionsHTMLArray.push('"> ' + respBody.value[i].fullname + '</option>');
                    }
                    this.datalistElement.innerHTML = optionsHTMLArray.join("");
                    this.localNotifyOutputChanged
                })
                .catch(error => console.log('error', error));

        }
        else {
            console.log("in else");
            console.log(this.inputElement.value);
            this.getDetails(this.inputElement.value)
        }
    }

    getDetails(value: string) {
        let key = "Name"
        if (value.indexOf(key) > -1) {
            var response = value.split(",");
            let _siret = value.substring(value.indexOf(key) + 6, value.length);


            console.log(response)

            this._name = response[0].substring(response[0].indexOf(':') + 1, response[0].length)
            this._phoneNumber = response[1].substring(response[1].indexOf(':') + 1, response[1].length)
            this._email = response[2].substring(response[2].indexOf(':') + 1, response[2].length)
            // this._libelleCodeNAF = response.resultats_siret[0].libelle_code_naf
            // this._formeJuridique = response.resultats_siret[0].forme_juridique
            // this._adresse = response.resultats_siret[0].siege.adresse_ligne_1
            // this._code_postal = response.resultats_siret[0].siege.code_postal
            // this._ville = response.resultats_siret[0].siege.ville
            this.localNotifyOutputChanged();

        }
        else {
            return {};
        }

    }

    /** 
     * It is called by the framework prior to a control receiving new data. 
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {

        return {
            value: this._name,
            phoneNumber: this._phoneNumber,
            name: this._name,
            email: this._email,
            // libelleCodeNAF: this._libelleCodeNAF,
            // formeJuridique: this._formeJuridique,
            // adresse: this._adresse,
            // code_postal: this._code_postal,
            // ville: this._ville,
        };
    }

    /** 
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
