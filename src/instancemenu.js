function createOption(value, text) {
  var element = document.createElement("option");
  
  element.value = value;
  element.text = text;
  
  return element;
}

function setupOptions(options) {
  var newOptions = [];
  
  for (var i = 0, l = options.length; i < l; i++) {
    newOptions[i] = [options[i], i];
  }
  
  return newOptions;
}

function refreshInstanceParentAndAttachments(id) {
  var parentFieldset = document.getElementById("parent-" + id);
        
  if (parentFieldset) {
    var parentSelect = parentFieldset.childNodes[1];
    var attachmentSelect = parentFieldset.childNodes[3];
    
    refreshInstanceParent(id, parentSelect, attachmentSelect, viewer.getParent(id))
  }
}

function onVisibilityClick(e) {
  var id = e.target.id.match(/\d+/)[0];
  var checked = e.target.checked;
  
  viewer.setVisibility(id, checked);
}

function onSequenceChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var sequence = parseInt(e.target.value, 10);
  
  viewer.setSequence(id, sequence);
}

function onSequenceLoopModeChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var sequenceLoopMode = parseInt(e.target.value, 10);
  
  viewer.setSequenceLoopMode(id, sequenceLoopMode);
}

function onLocationChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var childNodes = e.target.parentNode.childNodes;
  var x = parseFloat(childNodes[1].value) || 0;
  var y = parseFloat(childNodes[2].value) || 0;
  var z = parseFloat(childNodes[3].value) || 0;
  
  viewer.setLocation(id, [x, y, z]);
}

function onRotationChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var childNodes = e.target.parentNode.childNodes;
  var x = parseFloat(childNodes[1].value) || 0;
  var y = parseFloat(childNodes[2].value) || 0;
  var z = parseFloat(childNodes[3].value) || 0;
  var w = parseFloat(childNodes[4].value) || 0;
  
  viewer.setRotation(id, [x, y, z, w]);
}

function onScaleChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var n =  parseFloat(e.target.value) || 0;
  
  viewer.setScale(id, n);
}

function onParentChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var parent = parseInt(e.target.value, 10);
  var attachmentSelect = e.target.nextSibling.nextSibling;
  
  viewer.setParent(id, parent, -1);
  
  refreshInstanceAttachments(id, attachmentSelect, viewer.getAttachments(parent));
  
  for (var i = 0, l = instances.length; i < l; i++) {
    var instance = instances[i];
    
    if (instance[0] !== id) {
      refreshInstanceParentAndAttachments(instance[0]);
    }
  }
}

function onAttachmentChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var parent = parseInt(e.target.previousSibling.previousSibling.value, 10);
  var attachment = parseInt(e.target.value, 10);
  
  viewer.setParent(id, parent, attachment);
}

function onTeamColorChange(e) {
  var id = e.target.parentNode.id.match(/\d+/)[0];
  var teamColor = parseInt(e.target.value, 10);
  
  viewer.setTeamColor(id, teamColor);
}

function onTextureChange(e) {
  var td = e.target.parentNode;
  var id = td.parentNode.parentNode.id.match(/\d+/)[0];
  var oldPath = e.target.id;
  var newPath = e.target.value;
  
  viewer.overrideTexture(id, oldPath, newPath);
}

function createFieldset(legend) {
  var fieldset = document.createElement("fieldset");
  var leg = document.createElement("legend");
  
  leg.textContent = legend;
  
  fieldset.appendChild(leg);
  
  return fieldset;
}

function createSelect(options) {
  var select = document.createElement("select");
  
  for (var i = 0, l = options.length; i < l; i++) {
    var option = options[i];
    
    select.add(createOption(option[0], option[1]));
  }
  
  return select;
}

function createTextInput(value, onchange) {
  var input = document.createElement("input");
  
  input.type = "text";
  input.size = 2;
  input.value = value;
  
  if (onchange) {
    addEvent(input, "change", onchange);
  }
  
  return input;
}

function instanceOnclick(e) {
  var p = e.target;
  var div = e.target.nextSibling;
  var display = div.style.display;
  
  if (display === "none") {
    div.style.display = "initial";
  } else {
    div.style.display = "none";
  }
}

function setupOptions(options) {
  var opts = [];
  
  opts[0] = [-1, "None"];
  
  for (var i = 0, l = options.length; i < l; i++) {
    opts[i + 1] = [i, options[i]];
  }
  
  return opts;
}

function refreshInstanceParent(id, parentSelect, attachmentSelect, parent) {
  var i, l;
  var instance, instanceParent;
  
  parentSelect.innerHTML = "";
  parentSelect.add(createOption(-1, "None"));
  
  for (i = 0, l = instances.length; i < l; i++) {
    instance = instances[i];
    instanceParent = viewer.getParent(instance);
    
    if (instance !== id && instanceParent[0] !== id) {
      parentSelect.add(createOption(instance, getFileName(viewer.getSource(instance)) + " [" + instance + "]"));
      
      if (parent[0] === instance) {
        parentSelect.selectedIndex = parentSelect.length - 1;
      }
    }
  }
  
  attachmentSelect.innerHTML = "";
  attachmentSelect.add(createOption(-1, "None"));
  
  if (parentSelect.value !== "-1") {
    var attachments = viewer.getAttachments(parent[0]);
    
    for (i = 0, l = attachments.length; i < l; i++) {
      attachmentSelect.add(createOption(i, attachments[i]));
    }
    
    attachmentSelect.selectedIndex = parent[1] + 1;
  }
}

function refreshInstanceAttachments(id, attachmentSelect, attachments) {
  attachmentSelect.innerHTML = "";
  attachmentSelect.add(createOption(-1, "None"));
  
  if (attachments) {
    for (var i = 0, l = attachments.length; i < l; i++) {
      attachmentSelect.add(createOption(i, attachments[i]));
    }
  }
}

function fillMap(input, output) {
  var keys = Object.keys(input);
  
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    
    output[key] = input[key];
  }
}

function addTextureToMap(textureMapTable, key, value) {
  //console.log("TextureToMap", key, value);
  var keyName = getFileName(key);
  var valueName = getFileName(value);
  var tr = document.createElement("tr");
  var td1 = document.createElement("td");
  
  td1.appendChild(document.createTextNode(keyName));
  
  var td2 = document.createElement("td");
  
  var select = document.createElement("select");
  
  select.id = key;
  
  select.add(createOption("", "None"));
  
  for (var i = 0, l = textures.length; i < l; i++) {
    var texture = textures[i];
    
    select.add(createOption(texture[0], texture[1]));
    
    if (texture[0] === value) {
      select.selectedIndex = i + 1;
    }
  }
  
  addEvent(select, "change", onTextureChange);
  
  td2.appendChild(select);
  
  tr.appendChild(td1);
  tr.appendChild(td2);
  
  textureMapTable.appendChild(tr);
}

function refreshInstanceTextureMap(id) {
  var info = viewer.getInfo(id);
  var textureMapTable = document.getElementById("textures-" + id); 
  var textureMap = {};
  var modelInfo = info.modelInfo;
    
  if (modelInfo) {
    fillMap(modelInfo.textureMap, textureMap);
  }
  
  fillMap(info.textureMap, textureMap);
  
  textureMapTable.innerHTML = "";
  
  var keys = Object.keys(textureMap);
  
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    
    addTextureToMap(textureMapTable, key, textureMap[key]);
  }
}

function addInstance(id) {
  var instanceList = dom["instance-list"];
  var info = viewer.getInfo(id);
  var modelInfo = info.modelInfo;
  var location = info.location;
  var rotation = info.rotation;
  var scale = info.scale;
  
  var li = document.createElement("li");
  li.style.margin = "5px";
  
  var visibilityCheckbox = document.createElement("input");
  visibilityCheckbox.id = "visibility-" + id;
  addEvent(visibilityCheckbox, "click", onVisibilityClick);
  visibilityCheckbox.type = "checkbox";
  visibilityCheckbox.checked = info.visible;
  
  var text = document.createElement("p");
  text.textContent = getFileName(modelInfo.source) + " [" + id + "]";
  text.style.margin = "2px";
  text.style.display = "inline";
  addEvent(text, "click", instanceOnclick);
  
  var div = document.createElement("div");
  div.id = "instance-" + id;
  div.style.display = "none";
  
  // Sequence
  var sequenceFieldset = createFieldset("Sequence");
  sequenceFieldset.id = "sequence-" + id;
  var sequenceSelect = createSelect(setupOptions(modelInfo.sequences));
  addEvent(sequenceSelect, "change", onSequenceChange);
  sequenceSelect.selectedIndex = info.sequence + 1;
  sequenceFieldset.appendChild(sequenceSelect);
  
  // Sequence loop mode
  var sequenceLoopModeFieldset = createFieldset("Sequence Loop Mode");
  sequenceLoopModeFieldset.id = "sequence-loop-mode-" + id;
  var sequenceLoopModeSelect = createSelect([[0, "Default"], [1, "Never"], [2, "Always"]]);
  addEvent(sequenceLoopModeSelect, "change", onSequenceLoopModeChange);
  sequenceLoopModeSelect.selectedIndex = info.sequenceLoopMode;
  sequenceLoopModeFieldset.appendChild(sequenceLoopModeSelect);
  
  // Location
  var locationFieldset = createFieldset("Location");
  locationFieldset.id = "location-" + id;
  locationFieldset.appendChild(createTextInput(location[0], onLocationChange));
  locationFieldset.appendChild(createTextInput(location[1], onLocationChange));
  locationFieldset.appendChild(createTextInput(location[2], onLocationChange));
  
  // Rotation
  var rotationFieldset = createFieldset("Rotation");
  rotationFieldset.id = "rotation-" + id;
  rotationFieldset.appendChild(createTextInput(rotation[0], onRotationChange));
  rotationFieldset.appendChild(createTextInput(rotation[1], onRotationChange));
  rotationFieldset.appendChild(createTextInput(rotation[2], onRotationChange));
  rotationFieldset.appendChild(createTextInput(rotation[3], onRotationChange));
  
  // Scale
  var scaleFieldset = createFieldset("Scale");
  scaleFieldset.id = "scale-" + id;
  scaleFieldset.appendChild(createTextInput(scale, onScaleChange));
  
  // Parent
  var parentFieldset = createFieldset("Parent");
  parentFieldset.id = "parent-" + id;
  var parentSelect = createSelect([]);
  var attachmentSelect = createSelect([]);
  //refreshInstanceParentAndAttachments(id);
  addEvent(parentSelect, "change", onParentChange);
  addEvent(attachmentSelect, "change", onAttachmentChange);
  parentFieldset.appendChild(parentSelect);
  parentFieldset.appendChild(document.createElement("br"));
  parentFieldset.appendChild(attachmentSelect);
  
  // Team color
  var teamColorFieldset = createFieldset("Team Color");
  teamColorFieldset.id = "team-color-" + id;
  var teamColorSelect = createSelect([[0, "Red"], [1, "Blue"], [2, "Teal"], [3, "Purple"], [4, "Yellow"], [5, "Orange"], [6, "Green"], [7, "Pink"], [8, "Grey"], [9, "Light Blue"], [10, "Dark Green"], [11, "Brown"], [12, "Black"]]);
  addEvent(teamColorSelect, "change", onTeamColorChange);
  teamColorSelect.selectedIndex = info.teamColor;
  teamColorFieldset.appendChild(teamColorSelect);
  
  // Texture map
  var textureMapFieldset = createFieldset("Texture Map");
  textureMapFieldset.id = "textures-" + id;
  var textureMapTable = document.createElement("table");
  //refreshInstanceTextureMap(info, textureMapTable);
  textureMapFieldset.appendChild(textureMapTable);
  
  div.appendChild(sequenceFieldset);
  div.appendChild(sequenceLoopModeFieldset);
  div.appendChild(locationFieldset);
  div.appendChild(rotationFieldset);
  div.appendChild(scaleFieldset);
  div.appendChild(parentFieldset);
  div.appendChild(teamColorFieldset);
  div.appendChild(textureMapFieldset);
  
  li.appendChild(visibilityCheckbox);
  li.appendChild(text);
  li.appendChild(div);
  
  instanceList.appendChild(li);
}

function selectInstance(picked) {
  var container = dom["instance-list"];
  var nodes = container.children;
  var item, id;
  
  for (var i = 0, l = nodes.length; i < l; i++) {
    item = nodes[i].children[2];
    id = parseInt(item.id.split("-")[1], 10);
    
    if (id === picked) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  }
}