Issue when moving to felibs 7.3.0:
    toggle visibility, popups
        works with original felibs
        doesn't with 7.3.0
        does with 7.2.0
    update selection box
        map.component: bbox correctly flagged as 'to be updated'
            layersSvc.updateLayer: 
                updateLayerOrGroupInStore: correctly updates value of bbox in layerSvc.store$
                filterFiltertype: correctly updates layerSvc.overlays$ from layerSvc.store$
                    map-ol.component.addUpdateLayer: correctly triggered by change in layerSvc.overlays$
                        mapSvc.getLayerByKey: correctly returns current version of layer
                        BUT: in addUpdateLayer, the bboxlayer is never changed. It is not part of any of the if-clauses listed there.
                            Maybe if it was a customLayer? There's an if-clause for that....
                                Yes! Using a custom layer fixed it.


Summary:
    7.3.0 breaks toggle-visibility and popups. Also, x instanceof y does sometimes not seem to work anymore. <-- downgraded to 7.2.0
    7.2.0, on the other hand, couldn't update UkisVectorLayers (while 7.3.0 can), which is why the bbox-selection didnt get updated <-- turned bbox into a UkisCustomLayer

Future:
    wait until 7.x fixes the toggle-visibility, popups, and instanceof problems. Only then update.