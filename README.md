# PCF-ICK-Pappers
# English 

Dynamics365 / PowerApps PCF Control consumes the API from https://www.pappers.fr and auto complete French  registered companies data.


The auto complete will populate the following data, but feel free to extend this to your needs, personally I only store a minimum about of data using this PCF control, and the rest of the data is populated just after via a MS Flow.

Thoses fieds are:
* Registered Company Name
* Siret
* NAF Code
* NAF Code full name
* Juridical status (SASU, SAS, ...)
* Address
* Postal Code
* City

Limitation :

The API limits the number of requests to 100 a day

Be careful, every letter typed is a request !

# French 

Ce control PCF Dynamics365 permet de mettre en place l'autocomplete sur le champs du nom du Compte, à partir de l'API fournie par Pappers (https://www.pappers.fr/) 

Une fois le choix fait sur l'autocomplete, les informations récupérées sont :

Les champs sont:
* Raison sociale de l'entreprise
* Siret
* Code NAF
* Libelle du Code Naf
* Forme juridique de l'entreprise (SASU, SAS, ...)
* Adresse
* Code Postal
* Ville

Limitation : 

L'API utilisé impose une limite de 100 recherches par 24h

Attention, chaque lettre tapé est une requete !

Screenshot:

![Screenshot](French Company SIRENE Autocomplete.png)


