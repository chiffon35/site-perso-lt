LT_TOOLS.SpiderGraph = (function () {
    //©2013 Loïc TRUCHOT
    //Outils requis : LT_TOOLS.oSvgHelper
    //Outils requis : LT_TOOLS.oMathHelper
    //Outils requis : LT_TOOLS.oStringHelper
    //Outils requis : LT_TOOLS.oErrorHelper
    
    "use strict";
    //constantes de classe
    SpiderGraph.NB_AXES_MIN = 3;
    SpiderGraph.NB_AXES_MAX = 10;
    SpiderGraph.NB_ECHELONS_MIN = 3;
    SpiderGraph.NB_ECHELONS_MAX = 10;
    SpiderGraph.NB_AIRES_MIN = 1;
    SpiderGraph.NB_AIRES_MAX = 3;
    
    //variables de classe
    SpiderGraph.nombre = 0;
    
    function SpiderGraph (iTailleCadreSvg, tabAxes, tabEchelons, tabAires, sTitre, bLegende) {
        
        //Références à LT TOOLS
        this.oMath = LT_TOOLS.oMathHelper;
        this.oSvg = LT_TOOLS.oSvgHelper;
        this.oString = LT_TOOLS.oStringHelper;
        this.oError = LT_TOOLS.oErrorHelper;
        
        //gestion des erreurs
        this.tabMsgErreur = [];
        
        //elements obligatoires
        this.iTailleCadreSvg = this.oError.confirmerTypePropriete(this.tabMsgErreur, iTailleCadreSvg, "number", "la taille du graphique doit être saisie");
        this.tabAxes = this.oError.confirmerTypePropriete(this.tabMsgErreur, tabAxes, "array", "il faut définir entre " + SpiderGraph.NB_AXES_MIN + " et " + SpiderGraph.NB_AXES_MAX + " axes au graphique");
        
        //elements subsidiaires
        this.tabEchelons = tabEchelons || [];
        this.tabAires = tabAires || [];
        this.sTitre = sTitre || "";
        this.bLegende = bLegende || false;
        
        
        //données statistiques        
        this.iNbAxes = this.tabAxes.length;        
        this.iNbEchelons = this.tabEchelons.length;        
        
        //données géométriques        
        this.iTailleDemiCadre = iTailleCadreSvg / 2;
        this.iTailleMargeInterne = 0.5 * this.iTailleCadreSvg;        
        this.sTailleCadreSvgCoteEnPx = this.iTailleCadreSvg + "px";
        this.iTailleAxe = (this.iTailleCadreSvg - this.iTailleMargeInterne)  / 2;
        
                
        //données géométriques calculées
        this.iTailleAngle = 360 / this.iNbAxes;        
        this.iQuotienY1 = this.oMath.arrondir(- (this.iTailleAxe / (this.iNbEchelons -1)), 2);
        this.iQuotienY2 = this.oMath.arrondir(this.iQuotienY1 * this.oMath.cosinus(this.iTailleAngle), 2);
        this.iQuotienX2 = this.oMath.arrondir(this.iQuotienY1 * this.oMath.sinus(this.iTailleAngle), 2);
        this.tabCoordonnees = this.calculerMatriceCoordonnees();
        
        
        //données DOM/SVG calculées      
        this.sIdSvgCadre = "spiderGraph" + SpiderGraph.nombre; 
        
        //construction du graphique
        this.sGraphiqueSvg = this.creerGraphiqueSvg();
        this.nodeGraphiqueSvg = this.oSvg.parser(this.sGraphiqueSvg);
        
        //rapport d'erreurs
        this.oError.enregistrerErreurs(this.tabMsgErreur, this.sNomObjet);
        
        //action sur les variables de classe
        SpiderGraph.nombre++; 
        
    }    
    SpiderGraph.prototype = {        
        creerGraphiqueSvg : function () {
            var sGraphique = "";
            var sDefs = this.creerGraphDefinition();
        
            //titre
            sGraphique += this.ecrireGraphTitre();
            
            //Contenu
            if (sDefs !== "") {
                sGraphique += sDefs;
                sGraphique += "\t" + '<g transform="translate(' + this.iTailleDemiCadre + ', ' + this.iTailleDemiCadre + ')">' + "\n";
                sGraphique += this.creerRotationDesDefinitions();
                sGraphique += this.dessinerGraphAires();
                sGraphique += this.ecrireGraphEchelons();
                sGraphique += this.ecrireGraphAxes();
                sGraphique += "\t" + '</g>' + "\n";
            }
           
            
            //Legende            
            sGraphique += this.ecrireGraphLegende();
            
            sGraphique = this.insererDansEltSvg(sGraphique);
            
            return sGraphique;
        },
        insererDansEltSvg : function (sContenuSvg) {
            
            //---------- debut variables -----------
            var sEltSvg = "";
            var sEnteteSvg = "";
            var sPiedSvg = ""; 
            var tabAttributs = {                               
                "version" : "1.1",
                "xmlns:xlink"  : "http://www.w3.org/1999/xlink",
                "xmlns" : "http://www.w3.org/2000/svg",
                "class" : "SpiderGraph",
                "height" : this.sTailleCadreSvgCoteEnPx,
                "width" : this.sTailleCadreSvgCoteEnPx,
                "id" : this.sIdSvgCadre                
            }; 
            //---------- fin variables -----------
            
            
            //---------- debut procédure ------------
            //entete
            sEnteteSvg += '<svg';
            for (var cleAttr in tabAttributs) {
                sEnteteSvg += ' ' + cleAttr + '="' + tabAttributs[cleAttr] + '"';
            }       
            sEnteteSvg += '>' + "\n";
            
            //pied
            sPiedSvg += '</svg>' + "\n";  
            
            //element final
            sEltSvg = sEnteteSvg + sContenuSvg + sPiedSvg;
            //---------- fin procédure ------------
            
            return sEltSvg;            
        },
        creerGraphDefinition : function () {
            var sDefs = "";
            var sAxePrimaire = this.dessinerDefAxePrimaire();
            if (sAxePrimaire !== "") {
                sDefs += "\t" + '<defs>' + "\n";
                sDefs += "\t\t" + '<g id="toile">' + "\n";            
                sDefs += sAxePrimaire;  
                sDefs += this.dessinerDefEchelonsPrimaires();            
                sDefs += "\t\t" + '</g>' + "\n";
                sDefs += "\t" + '</defs>' + "\n";
            }
            return sDefs;
        },        
        dessinerDefAxePrimaire : function () {
            var sAxePrimaire = "";
            if (this.iNbAxes >= SpiderGraph.NB_AXES_MIN && this.iNbAxes <= SpiderGraph.NB_AXES_MAX) {
                sAxePrimaire += "\t\t\t" + '<line class="rayon" y2="' + ( - this.iTailleAxe)  +'"/>' + "\n"; 
            }
            return sAxePrimaire;
        },
        dessinerDefEchelonsPrimaires : function () {
            var sEchelonsPrimaires = "";
            if (this.iNbEchelons >= SpiderGraph.NB_ECHELONS_MIN && this.iNbEchelons <= SpiderGraph.NB_ECHELONS_MAX) {
                var iX2 = this.iQuotienX2;
                var iY1 = this.iQuotienY1;
                var iY2 = this.iQuotienY2;
                for (var cpt = 0; cpt < (this.iNbEchelons - 1); cpt++) {
                   sEchelonsPrimaires += "\t\t\t" + '<line x1="0" x2="' + iX2 + '" y1="' + iY1 + '" y2="' + iY2 + '" />' + "\n"; 
                    iX2 += this.iQuotienX2;
                    iY1 += this.iQuotienY1;
                    iY2 += this.iQuotienY2;
                } 
            }
            return sEchelonsPrimaires;            
        },
        creerRotationDesDefinitions : function () {
            var sRotations = "";
            var iRotation = 0;
            for (var cleAxes in this.tabAxes) {                
                sRotations += "\t\t" + '<use xlink:href="#toile" transform="rotate(' + iRotation + ')" />' + "\n";
                iRotation += this.iTailleAngle;
            }       
            return sRotations;
        },
        dessinerGraphAires : function () {
            var sAires = "";
            for (var cleAire in this.tabAires) {
                sAires += '<polygon style="stroke:' + this.tabAires[cleAire][0] + ';" ';
                var sPoints = "";
                var tabAireEchelon = this.tabAires[cleAire][1];
                for (var iAxe in tabAireEchelon) {                    
                    var iEchelon = tabAireEchelon[iAxe];
                    sPoints += this.tabCoordonnees[iAxe][iEchelon].x   + "," + this.tabCoordonnees[iAxe][iEchelon].y + " ";                    
                }
                sAires += 'points="' + sPoints + '" />';
            }
            return sAires;
        },
        ecrireGraphTitre : function () {
            var sTitre = "";
            if (this.sTitre !== "") {
                sTitre += "\t" + '<g transform="translate(' + this.iTailleDemiCadre + ' 25)"  id="titre">' + "\n";
                sTitre += "\t\t" + '<text>' + this.sTitre + '</text>' + "\n"; 
                sTitre +=  "\t" + '</g>' + "\n";
            }
            return sTitre;            
        },
        ecrireGraphEchelons : function () {
            var sNomsDesValeurs = "";
            sNomsDesValeurs += "\t\t" + '<g id="valeurs">' + "\n";
            var iY = 0;            
            for (var sEchelon in this.tabEchelons) {
                sNomsDesValeurs += "\t\t\t" + '<text x="5" y="' + (iY + 3) + '">' + this.tabEchelons[sEchelon] + '</text>' + "\n";
                iY += this.iQuotienY1;
            }
            sNomsDesValeurs += "\t\t" + '</g>' + "\n";
            return sNomsDesValeurs;
        },
        ecrireGraphAxes : function () {
            var sNomsDesAxes = "";            
            sNomsDesAxes = '<g id="labels">';
            var cptAxe = 0;
            for (var iAxe in this.tabAxes) {
                var iX = this.tabCoordonnees[cptAxe][this.iNbEchelons - 1].x;
                var iY = this.tabCoordonnees[cptAxe][this.iNbEchelons - 1].y;                
                var tabPlusieursMots = [];
                var sNomAxe = this.tabAxes[iAxe];
                
                //ajustement du nombre de ligne du texte
                if (iX !== 0) {
                    tabPlusieursMots = this.oString.decouperMotsParLongueur(sNomAxe, 12, " ");
                } 
                else {
                    tabPlusieursMots[0] = sNomAxe;
                }
                
                //ajustement de l'emplacement du texte
                //Nord
                var sStyleModificateur = "";
                if (iX === 0 && iY < 0) {
                        iY -= 15;                     
                }
                //Sud
                else if (iX === 0 && iY > 0) {
                iY += 15; 
                }
                //Est
                else if (iX > 0) {
                    iX += 5;
                    iY += 5;
                    sStyleModificateur = 'style="text-anchor:start;"';
                }
                //Ouest
                else if (iX < 0) {
                    iX -= 5;
                    iY += 5;
                    sStyleModificateur = 'style="text-anchor:end;"';
                }                 
                for (var cleMot in tabPlusieursMots) {
                    if (cleMot > 0) {
                        iY += 12;
                    }
                    sNomsDesAxes += "\t\t\t" + '<text x="' + iX + '" y="' + iY + '" ' + sStyleModificateur +  ' >' + tabPlusieursMots[cleMot] + '</text>' + "\n";                      
                }  
                cptAxe++;  
            }
            sNomsDesAxes += "</g>";
            return sNomsDesAxes;
        },
        ecrireGraphLegende : function () {
            var sLegende = "";
            if (this.bLegende) {
                sLegende += "\t" + '<g transform="translate(' + (this.iTailleMargeInterne / 4) + ' ' + (this.iTailleCadreSvg - (this.iTailleMargeInterne / 4)) + ')"  id="legende">' + "\n";
                var iY = 0;
                for (var cleAire in this.tabAires) {
                    sLegende += "\t\t" + '<line style="stroke:' + this.tabAires[cleAire][0] + ';" y1="' + iY + '" y2="' + iY + '" x2="20" />' + "\n";
                    sLegende += "\t\t" + '<text x="30" y="' + (iY + 3) + '">' + cleAire + '</text>' + "\n";
                    iY += 15;
                }
                sLegende +=  "\t" + '</g>' + "\n";
            }
            return sLegende;
        },
        calculerMatriceCoordonnees : function () {
            var tabCoordonnees = [];
            var iXEnRotation = 0;
            var iYEnRotation = this.iQuotienY1;
            
            //échelons de l'axe 0
            tabCoordonnees[0] = [];
            for (var iEchelonDeLAxe0 = 0; iEchelonDeLAxe0 < this.iNbEchelons; iEchelonDeLAxe0++) {
                tabCoordonnees[0][iEchelonDeLAxe0] = { "x" : 0, "y" : this.oMath.arrondir(this.iQuotienY1 * iEchelonDeLAxe0, 2)}; 
            }
            
            //échelons des autres axes par rotation
            for (var iAxe = 1; iAxe < this.iNbAxes; iAxe++){                
                tabCoordonnees[iAxe] = []; 
                for (var iEchelon = 0; iEchelon < this.iNbEchelons; iEchelon++) {
                    
                    //récupération des valeur d'échelon sur l'axe précédent
                    iXEnRotation = tabCoordonnees[iAxe-1][iEchelon].x;
                    iYEnRotation = tabCoordonnees[iAxe-1][iEchelon].y;
                    
                    //rotation des valeurs
                    var iX = (iXEnRotation * this.oMath.cosinus(this.iTailleAngle)) - (iYEnRotation  * this.oMath.sinus(this.iTailleAngle));
                    var iY = (iXEnRotation * this.oMath.sinus(this.iTailleAngle)) + (iYEnRotation  * this.oMath.cosinus(this.iTailleAngle));
                    iXEnRotation = this.oMath.arrondir(iX, 2);
                    iYEnRotation = this.oMath.arrondir(iY, 2);                                       
                    tabCoordonnees[iAxe][iEchelon] = { "x" : iXEnRotation, "y" : iYEnRotation};                    
                }                 
            }
            return tabCoordonnees;
        }
    }; 
    return SpiderGraph;
} ()); 