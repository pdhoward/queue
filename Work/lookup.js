

// lookup vs ppopulate - lookup happens on db server
Item = new Schema({
    id: Schema.ObjectId,
    dateCreated: { type: Date, default: Date.now },
    title: { type: String, default: 'No Title' },
    description: { type: String, default: 'No Description' },
    tags: [ { type: Schema.ObjectId, ref: 'ItemTag' }]
});

ItemTag = new Schema({
    id: Schema.ObjectId,
    tagId: { type: Schema.ObjectId, ref: 'Tag' },
    tagName: { type: String }
});


Item.aggregate(
    [
      { "$lookup": {
        "from": ItemTags.collection.name,
        "localField": "tags",
        "foreignField": "_id",
        "as": "tags"
      }},
      { "$unwind": "$tags" },
      { "$match": { "tags.tagName": { "$in": [ "funny", "politics" ] } } },
      { "$group": {
        "_id": "$_id",
        "dateCreated": { "$first": "$dateCreated" },
        "title": { "$first": "$title" },
        "description": { "$first": "$description" },
        "tags": { "$push": "$tags" }
      }}
    ],
    function(err, result) {
      // "tags" is now filtered by condition and "joined"
    }
  )