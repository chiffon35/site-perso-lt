LTTOoLS.oSvgHelper =  {   
    parser : function(sContenuSvg) {
        var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
        div.innerHTML = sContenuSvg;
        var oFragment = document.createDocumentFragment();
        oFragment.appendChild(div.firstChild)
        while (div.firstChild) {
            oFragment.firstChild.appendChild(div.firstChild);
        }
        return oFragment ;
    } 
};
