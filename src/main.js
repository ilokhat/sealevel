import * as itowns from 'itowns'
import GuiTools from './gui/GuiTools'
import {createWaterPlaneMesh, modify_level} from './waterPlane'

import IGN_MNT_HR from './layers/IGN_MNT_HIGHRES'
import DARK from './layers/DARK'
import Ortho from './layers/Ortho'
import {bati, shadMat, resultoss} from './layers/bati'
import {bati_raster} from './layers/bati_raster'
//import roads from './layers/roads'
import { getColor } from './layers/color'


// around Bordeaux
let positionOnGlobe = { longitude: -0.525, latitude: 44.85, altitude: 250 };
let coords = {lon: -0.650, lat: 44.905, deltaLon: 0.160, deltaLat: -0.110 };
// île de Ré
positionOnGlobe = { longitude: -1.412, latitude: 46.208, altitude: 10000 };
coords = {lon: -1.563, lat: 46.256, deltaLon: 0.300, deltaLat: -0.150 };

function adjustAltitude(value) {
    modify_level(globeView.water.geometry.getAttribute('position'), value);
    globeView.water.geometry.attributes.position.needsUpdate = true;
    globeView.water.updateMatrixWorld();
}

const viewerDiv = document.getElementById('viewerDiv');
const htmlInfo = document.getElementById('info');
const globeView = new itowns.GlobeView(viewerDiv, positionOnGlobe);
const menuGlobe = new GuiTools('menuDiv', globeView)

globeView.addLayer(DARK);
globeView.addLayer(IGN_MNT_HR);
//globeView.addLayer(Ortho);
globeView.addLayer(bati_raster);
globeView.addLayer(bati);
//globeView.addLayer(roads);
let plane = createWaterPlaneMesh(coords);


globeView.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, () => {
    globeView.scene.add(plane);
    globeView.water = plane;
    console.log('globe initialized ?', globeView);
    console.log(globeView.referenceCrs);
    
    menuGlobe.addImageryLayersGUI(globeView.getLayers( l => l.type === 'color'));
    menuGlobe.addGeometryLayersGUI(globeView.getLayers(l => l.type === 'geometry' && l.id != 'globe'));
    menuGlobe.gui.add({ waterLevel: 0.0 }, 'waterLevel').min(0).max(20).step(1).onChange((
        function updateWaterLevel(value) {
            //let lay = globeView.getLayers(l => l.id == 'WFS Buildings')[0];
            //console.log('lay', lay);
            
            adjustAltitude(value);
            shadMat.uniforms.waterLevel.value = value;
            
            globeView.notifyChange(true);
        }));
    //window.addEventListener('mousemove', pickingRaster, false);

});


// function pickingGeomLayer(event) {
//     console.log('resultoss ', resultoss);
    
//     let lay = globeView.getLayers(l => l.id == 'WFS Buildings')[0];
//     const layer_is_visible = globeView.getLayers(l => l.id == 'WFS Buildings')[0].visible;
//     if (!layer_is_visible)
//         return;
//     let results = globeView.pickObjectsAt(event, 1, 'WFS Buildings');
//     //let results = lay.pickObjectsAt(globeView, event, 5);
//     if (results.length < 1){
//         console.log("no fucking properties");
//         return;
//     }
//     console.log("res length ", results[0]);
//     htmlInfo.innerHTML = 'Batiment';
//     htmlInfo.innerHTML += '<hr>';
//     let props = results[0].object.properties;
//     console.log(props);
    
//     for (const k in props) {
//         // if (k === 'bbox' || k === 'geometry_name' || k === 'id' || k === 'id_parc' || k === 'imu_dir')
//         //     continue;
//         htmlInfo.innerHTML += '<li><b>' + k + ':</b> [' + props[k] + ']</li>';
//     }
// };

// function pickingRaster(event) {
//     let layer = globeView.getLayers(l => l.id == 'WFS Buildings rasterized')[0];
//     if (layer.visible == false)
//         return;
//     let geocoord = globeView.controls.pickGeoPosition(globeView.eventToViewCoords(event));
//     if (geocoord === undefined)
//         return;
//     let result = itowns.FeaturesUtils.filterFeaturesUnderCoordinate(geocoord, layer.feature, 5);
//     htmlInfo.innerHTML = 'Parcelle';
//     htmlInfo.innerHTML += '<hr>';
//     if (result[0] !== undefined) {
//         const props = result[0].feature.properties
//         for (const k in props) {
//             if (k === 'bbox' || k === 'geometry_name')
//                 continue;
//             htmlInfo.innerHTML += '<li>' + k + ': ' + props[k] + '</li>';
//         }
//     }
// }
