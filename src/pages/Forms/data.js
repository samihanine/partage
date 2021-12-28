import nationalities from './nationalities';
import pays from './pays';

class Input {
    static id = 0;
    constructor(props) {
        props = props || {};

        this.id = Input.id;

        this.type = props.type || "text";
        this.required = props.required === false ? props.required : true;
        this.title = props.title || "";
        this.placeholder = props.placeholder || "";
        this.pattern = props.pattern || null;
        this.options = props.options || [];
        this.maxLength = props.maxLength || null;
        this.minLength = props.minLength || null;
        this.name = this.title; //this.name = this.title.toLowerCase().replace(/ /g,"_");
        this.condition = props.condition || false;
        this.conditionValue = props.conditionValue || "";
        //if (this.condition) this.required = false;

        Input.id++;
    }

    static reset = () => {
        Input.id = 0;
    }
}

Input.reset();


const form_accident = [
    new Input({ title: "Colonne vide", type: "hidden" }),

    new Input({ title: "Identité du futur salarié (e)", type: "title" }),
]

Input.reset();

const form_dpae = [
    new Input({ title: "Colonne vide", type: "hidden" }),

    new Input({ title: "Identité du futur salarié (e)", type: "title" }),
    new Input({ title: "Civilité", options: ["Monsieur", "Madame"] }),
    new Input({ title: "Nom de naissance" }),
    new Input({ title: "Nom marital", required: false }),
    new Input({ title: "Prénom" }),
    new Input({ title: "Numéro de Sécurité sociale", minLength: 15, maxLength: 15, placeholder: "0000000000000" }),
    new Input({ title: "Date de naissance", type: "date" }),
    new Input({ title: "Département de naissance (99 si étranger)", type: "number" }),
    new Input({ title: "Commune de naissance" }),
    new Input({ title: "En étranger ? (oui / non)", options: ["oui", "non"] }),
    new Input({ title: "Pays de naissance", options: pays }),

    new Input({ title: "Nationalité", options: ["française", "membre communauté européenne", "autre"] }),
    new Input({ title: "Autre Nationalité", options: nationalities, condition: -1, conditionValue: ["membre communauté européenne", "autre"] }),
    new Input({ title: "Type de justificatif identité", options: ["carte identité nationale", "passeport", "carte de séjour", "récépissé de séjour"] }),
    new Input({ title: "Numéro du justificatif identité", type: "text" }),
    new Input({ title: "Date début de validité du justificatif", type: "date" }),
    new Input({ title: "Date fin de validité du justificatif", type: "date" }),

    new Input({ title: "Coordonées du futur salarié (e)", type: "title" }),
    new Input({ title: "Numéro" }),
    new Input({ title: "Bis/Ter", required: false }),
    new Input({ title: "Adresse" }),
    new Input({ title: "Complément d'adresse", required: false }),
    new Input({ title: "Code postal", type: "number", minLength: 5, maxLength: 5 }),
    new Input({ title: "Commune" }),
    new Input({ title: "Situation familiale", options: ["marié", "célibataire", "pacsé", "vie maritale"] }),
    new Input({ title: "Nombre d'enfant à charge", type: "number" }),
    new Input({ title: "Téléphone", type: 'tel', required: false  }),
    new Input({ title: "Mail", type: 'email', required: false  }),

    new Input({ title: "Informations contractuelles du futur salarié (e)", type: "title" }),
    new Input({ title: "Date d'embauche", type: "date" }),
    new Input({ title: "Heure d'embauche", type: "time" }),
    new Input({ title: "Employeur", options: ["Unique", "Multi-Employeurs"] }),
    new Input({ title: "Type de contrat", options: ["CDI", "CDD"] }),
    new Input({ title: "Date fin CDD", type: "date", condition: -1, conditionValue: ["CDD"] }),
    new Input({ title: "Motif CDD", options: ["remplacement", "surcroit", "chantier"], condition: -2, conditionValue: ["CDD"] }),
    new Input({ title: "Nom du client chantier", condition: -1, conditionValue: ["chantier"] }),
    new Input({ title: "Adresse du chantier", condition: -2, conditionValue: ["chantier"] }),
    new Input({ title: "Nombre jours période d'essai", type: "number" }),
    new Input({ title: "Statut", options: ["Employé", "Ouvrier", "Cadre", "Apprenti", "Stagiaire"] }),
    new Input({ title: "Heures travaillée semaine", type: "number" }),
    new Input({ title: "Salaire mensuel", options: ["brut", "net", "SMIC (conventionnel)"] }),
    new Input({ title: "Montant mensuel", type: "number", condition: -1, conditionValue: ["brut", "net"] }),
    new Input({ title: "Abonnement transport commun", options: ["oui", "non"] }),
    new Input({ title: "Montant abonnement mensuel", type: "number", condition: -1, conditionValue: ["oui"] }),
    new Input({ title: "Informations supplémentaires", required: false, type: "textarea" }),

    new Input({ title: "Fichiers", type: "title" }),
    new Input({ title: "Justificatif identité recto", type: "file" }),
    new Input({ title: "Justificatif identité verso", type: "file" }),
    new Input({ title: "Carte sécurité sociale", type: "file" }),
    new Input({ title: "Autres documents (si besoin)", type: "file", required: false }),
]

export const form_list = {
    dpae : {
        title: "dpae",
        data: form_dpae
    }
}
