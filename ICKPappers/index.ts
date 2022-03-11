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

    private _siret: string;
    private _companyName: string;
    private _codeNAF: string;
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
        this.inputElement.placeholder = "Search Companies Database...";
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
        ((this._companyName != undefined) ? this.inputElement.value = this._companyName : null)
    }

    public clearFields(evt: Event) {
        console.log("Clear Fields")

        this._companyName = ""
        this._siret = ""
        this._codeNAF = ""
        this._libelleCodeNAF = ""
        this._formeJuridique = ""
        this._adresse = ""
        this._code_postal = ""
        this._ville = ""
        this.localNotifyOutputChanged();
    }

    public getSuggestions(evt: Event) {

        // Connect to Suggestion Pappers API and get the suggestions as the user presses keys and update dropdown.
        let input = (this.inputElement.value as any) as string;
        let key = "SIRET";
        if (input.indexOf(key) == -1 && input.length > 0) {
            this.datalistElement.innerHTML = "";            
            let query = "v2?q=" + encodeURIComponent(input)+ "&longueur=5";
            let options = {
                host: 'suggestions.pappers.fr/',
                path: query
            }
            const https = require('https');

            https.get(options, (resp: any) => {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', (chunk: any) => {
                    data += chunk;
                });
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    var response = JSON.parse(data);
                    console.log(response);
                    var optionsHTML = "";
                    var optionsHTMLArray = new Array();
                    for (var i = 0; i < response.resultats_nom_entreprise.length; i++) {
                        optionsHTMLArray.push('<option value="');
                        optionsHTMLArray.push(response.resultats_nom_entreprise[i].denomination + ' (' + response.resultats_nom_entreprise[i].siege.code_postal + ' ' + response.resultats_nom_entreprise[i].siege.ville + ')' + ' - SIRET:' + response.resultats_nom_entreprise[i].siege.siret);
                        optionsHTMLArray.push('"> ' + response.resultats_nom_entreprise[i].domaine_activite+ '</option>');                        
                    }
                    this.datalistElement.innerHTML = optionsHTMLArray.join("");
                    this.localNotifyOutputChanged
                });

            }).on("error", (err: { message: string; }) => {
                console.log("Error: " + err.message);
            });
        }
        else {
            console.log("in else");
            this.getDetails(this.inputElement.value)
        }
    }

    getDetails(value: string) {
        let key = "SIRET"
        if (value.indexOf(key) > -1) {
            let _siret = value.substring(value.indexOf(key) + 6, value.length);
            let query = "v2?q=" + _siret + "&cibles=siret";
            let options = {
                host: 'suggestions.pappers.fr/',
                path: query
            }
            
            const https = require('https');

            https.get(options, (resp: any) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk: any) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    var response = JSON.parse(data);
                    console.log(response)
                    this._siret = response.resultats_siret[0].siege.siret_formate
                    this._companyName = response.resultats_siret[0].denomination
                    this._codeNAF = response.resultats_siret[0].code_naf
                    this._libelleCodeNAF = response.resultats_siret[0].libelle_code_naf
                    this._formeJuridique = response.resultats_siret[0].forme_juridique
                    this._adresse = response.resultats_siret[0].siege.adresse_ligne_1
                    this._code_postal = response.resultats_siret[0].siege.code_postal
                    this._ville = response.resultats_siret[0].siege.ville
                    this.localNotifyOutputChanged();

                });

            }).on("error", (err: { message: string; }) => {
                console.log("Error: " + err.message);
            });
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
            value: this._companyName,
            siret: this._siret,
            companyName: this._companyName,
            codeNAF: this._codeNAF,
            libelleCodeNAF: this._libelleCodeNAF,
            formeJuridique: this._formeJuridique,
            adresse: this._adresse,
            code_postal: this._code_postal,
            ville: this._ville,
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
