// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

function Attachment(attachment, model) {
  this.node = attachment.node;
  this.path = attachment.path;
  this.attachmentId = attachment.attachmentId;
  this.name = model.nodes[this.node].name;
  this.sd = parseSDTracks(attachment.tracks, model);
}