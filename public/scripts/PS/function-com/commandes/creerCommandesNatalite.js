var PS = PS || {};
PS.creerCommandesNatalite = function (oNatalite) {
    var oCommandes = [ 
        {
            sNomCommande : "Prestations familiales :",
            sIdCommande : "iPrestationFamiliale",
            sType : "radio",
            iValeurChecked : oNatalite.iPrestationFamiliale,
            tabRadios : [
                { 
                    sLabel : "Aucune",
                    iValeur: 0
                },
                { 
                    sLabel : "Politique de l'enfant unique",
                    iValeur: 1
                },
                { 
                    sLabel : "Allocations Familiales",
                    iValeur: 2
                }
            ]
        },
        {
            sNomCommande : "Contraception : ",
            sIdCommande : "iContraception",
            sType : "radio",
            iValeurChecked : oNatalite.iContraception,
            tabRadios : [
                {
                    sLabel : "Illégale",
                    iValeur: 0
                },
                {
                    sLabel : "Autorisée",
                    iValeur: 1
                },
                {
                    sLabel : "Autorisée et gratuite",
                    iValeur: 2
                }
            ]
        },
        {
            sNomCommande : "Avortement : ",
            sIdCommande : "iAvortement",
            sType : "radio",
            iValeurChecked : oNatalite.iAvortement,
            tabRadios : [
                {
                    sLabel : "Illégal",
                    iValeur: 0
                },
                {
                    sLabel : "Autorisé",
                    iValeur: 1
                },
                {
                    sLabel : "Autorisé et gratuit",
                    iValeur: 2
                }
            ]
        },
        {
            sNomCommande : "Salaire parental : ",
            sIdCommande : "iSalaireParental",
            sType : "radio",
            iValeurChecked : oNatalite.iSalaireParental,
            tabRadios : [
                {
                    sLabel : "Non",
                    iValeur: 0
                },
                {
                    sLabel : "Oui",
                    iValeur: 1
                }
            ]
        },
        {
            sNomCommande : "Places en crèches : ",
            sIdCommande : "iPlacesEnCreches",
            sType : "radio",
            iValeurChecked : oNatalite.iPlacesEnCreches,
            tabRadios : [
                {
                    sLabel : "Privées",
                    iValeur: 0
                },
                {
                    sLabel : "Remboursées pour les bas salaires",
                    iValeur: 1
                },
                {
                    sLabel : "Remboursées pour tous",
                    iValeur: 2
                }
            ]
        },
        {
            sNomCommande : "Programmes scolaires : ",
            sIdCommande : "iProgrammeScolaire",
            sType : "radio",
            iValeurChecked : oNatalite.iProgrammeScolaire,
            tabRadios : [
                
                {
                    sLabel : "Anti-nataliste",
                    iValeur: 0
                },
                {
                    sLabel : "Neutre",
                    iValeur: 1
                },
                {
                    sLabel : "Pro-nataliste",
                    iValeur: 2
                }
            ]
        },
        {
            sNomCommande : "Eugénisme d'état par critères : ",
            sIdCommande : "E_MP_eugenisme",
            sType : "checkbox",
            tabCheckboxes : [
                {
                    sLabel : "éthnique",
                    sChecked : false,
                    iValeur: 0
                },
                {
                    sLabel : "économique",
                    sChecked : false,
                    iValeur: 1
                },
                {
                    sLabel : "religieux",
                    sChecked : false,
                    iValeur: 2
                },
                {
                    sLabel : "de handicap léger",
                    sChecked : false,
                    iValeur: 2
                },
                {
                    sLabel : "de handicap lourd",
                    sChecked : true,
                    iValeur: 2
                }  
            ]
        },
        {
            sNomCommande : "Divers : ",
            sIdCommande : "E_MP_divers",
            sType : "checkbox",
            tabCheckboxes : [
                {
                    sLabel : "Subventions aux crèches d'entreprise",
                    sChecked : true,
                    iValeur: 0
                },
                {
                    sLabel : "Autoriser l'eugénisme privé",
                    sChecked : false,
                    iValeur: 0
                },
                {
                    sLabel : "Autoriser la marchandisation de la reproduction",
                    sChecked : false,
                    iValeur: 0
                }, 
            ]
        }
    ]
    return oCommandes;
}

if (typeof module !== "undefined") {
    module.exports = PS.creerCommandesNatalite;
}