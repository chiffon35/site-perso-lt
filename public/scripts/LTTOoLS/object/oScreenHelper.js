LTTOoLS.oScreenHelper =  {
    prechargerImages : function (tabImages) { 
        var tabImagesChargees = [];
		for (var i = 0; i < tabImages.length; i++) {
            var image = new Image();
			image.src = tabImages[i];
            tabImagesChargees.push(image);
		}       
    } 
    
};
