package models

import "time"

// LatestError ...
type LatestError struct {
	Description string    `json:"description" bson:"Description"`
	ErrorAt     time.Time `json:"errorAt" bson:"ErrorAt"`
	RetryID     string    `json:"retryId" bson:"RetryID"`
}

// Error ...
type Error struct {
	Description string      `json:"description" bson:"Description"`
	Status      string      `json:"status" bson:"Status"`
	UpdatedAt   time.Time   `json:"updatedAt" bson:"UpdatedAt"`
	RunCount    int         `json:"runCount" bson:"RunCount"`
	RetryAt     time.Time   `json:"retryAt" bson:"RetryAt"`
	CreatedAt   time.Time   `json:"createdAt" bson:"CreatedAt"`
	LatestError LatestError `json:"latestError" bson:"LatestError"`
}

// ErrorResponse ...
type ErrorResponse struct {
	Errors             []Error `json:"errors"`
	TotalDocumentCount int     `json:"totalDocumentCount"`
}
