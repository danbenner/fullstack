package controllers

import (
	"fullstack/src/go/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthController ...
type HealthController struct {
	HTTPClient services.HTTPClient
}

// NewHealthController ...
func NewHealthController(httpClient services.HTTPClient, r *gin.Engine) HealthController {
	hc := HealthController{HTTPClient: httpClient}
	hc.InitRoutes(r)
	return hc
}

// InitRoutes ...
func (hc HealthController) InitRoutes(r *gin.Engine) {
	r.GET(`/health`, hc.HealthCheck)
}

// HealthCheck ...
func (hc HealthController) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, `Health Check Successful!`)
}
