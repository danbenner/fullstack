package controllers

import (
	"fullstack/src/go/middleware"
	"fullstack/src/go/models"
	"fullstack/src/go/pkg/logger"
	"fullstack/src/go/pkg/mongodb"
	"fullstack/src/go/services"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/gin-gonic/gin"
)

// AdminController ...
type AdminController struct {
	HTTPClient services.HTTPClient
}

// NewMongoController ...
func NewMongoController(httpClient services.HTTPClient, r *gin.Engine) AdminController {
	ac := AdminController{HTTPClient: httpClient}
	ac.initRoutes(r)
	return ac
}

func (ac AdminController) initRoutes(r *gin.Engine) {
	r.GET(`/api/errors`, middleware.EL(), ac.FetchErrors)
}

// FetchErrors ...
func (ac AdminController) FetchErrors(c *gin.Context) {
	log := logger.WithContext(logger.Context{})
	queryParams := c.Request.URL.Query()

	limit, err := strconv.Atoi(queryParams.Get("limit"))
	if err != nil {
		log.Error(err)
		c.JSON(400, "Unable to parse limit parameter")
		return
	}
	offset, err := strconv.Atoi(queryParams.Get("offset"))
	if err != nil {
		log.Error(err)
		c.JSON(400, "Unable to parse offset parameter")
		return
	}

	collec := mongodb.NewCollectionSession("TableName")

	// NOTE: this needs to be sorted, documents aren't in order
	pipe := []bson.M{
		bson.M{"$project": bson.M{
			"Description": 1,
			"Status":      1,
			"UpdatedAt":   1,
			"RunCount":    1,
			"RetryAt":     1,
			"CreatedAt":   1,
			"LatestError": bson.M{
				"$arrayElemAt": []interface{}{"$Errors", -1},
			},
		}},
		bson.M{"$match": bson.M{
			"Status": "retry",
		}},
		bson.M{"$limit": limit},
		bson.M{"$skip": offset},
	}

	cursor, err := collec.Aggregate(c, pipe)
	if err != nil {
		log.Errorf("AdminController: %s", err)
		c.JSON(500, err.Error())
		return
	}

	var errors []models.Error
	count := 0

	for cursor.Next(c) {
		if count >= limit {
			break
		}
		count++
		var tableError models.Error

		if err := cursor.Decode(&tableError); err != nil {
			log.Errorf("Error decoding tableError %s", err)
			c.JSON(500, err.Error())
			return
		}
		errors = append(errors, tableError)
	}

	totalCount, err := collec.CountDocuments(c, bson.M{"Status": "retry"})
	if err != nil {
		log.Errorf("Error retrieving total document count %s", err)
	}

	c.JSON(200, models.ErrorResponse{
		Errors:             errors,
		TotalDocumentCount: int(totalCount),
	})
}
