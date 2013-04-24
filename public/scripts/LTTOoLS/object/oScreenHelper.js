LTTOoLS.oScreenHelper =  {
    prechargerImages : function (tabImages) { 
        var tabImagesChargees = [];
		for (var i = 0; i < tabImages.length; i++) {
            tabImagesChargees[i] = new Image();
			tabImagesChargees[i].src = tabImages[i];
		}    
        return tabImagesChargees;
    } 
    
};
