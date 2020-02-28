package mongodb

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/x/bsonx"
)

// NewCollectionSession ...
func NewCollectionSession(collectionName string) (c *mongo.Collection) {
	c = MongoClient.Database(DBNAME).Collection(collectionName)
	return
}

// NewCollectionWithIndex ... creates copy of original session with a Collection Name
// and ANY (including zero) index strings (to limit search);
// NOTE: 7 is the MAX number of index values, otherwise excedes 127 byte max limit for 'EnsureIndex'
func NewCollectionWithIndex(collectionName string, indexValues ...string) *mongo.Collection {
	c := NewCollectionSession(collectionName)

	opts := options.CreateIndexes().SetMaxTime(10 * time.Second)
	index := yieldIndexModel(false, indexValues...)

	c.Indexes().CreateOne(context.Background(), index, opts)
	return c
}

func yieldIndexModel(unique bool, indexValues ...string) mongo.IndexModel {
	keys := bsonx.Doc{}
	for _, field := range indexValues {
		keys = append(keys, bsonx.Elem{
			Key:   field,
			Value: bsonx.Int32(1),
		})
	}

	index := mongo.IndexModel{}
	index.Keys = keys

	// https://docs.mongodb.com/manual/core/index-unique/
	// A unique index ensures that the indexed fields don't
	// store duplicate values; i.e. enforces uniqueness for
	// the indexed fields. By default, MongoDB creates a unique
	// index on the _id field during the creation of a collection.
	// index.Options = index.Options.SetUnique(unique)

	return index
}
