package controllers

import (
	"fullstack/src/go/middleware"
	"fullstack/src/go/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// LoginController ...
type LoginController struct {
	HTTPClient services.HTTPClient
}

// NewLoginController ...
func NewLoginController(httpClient services.HTTPClient, r *gin.Engine) LoginController {
	lc := LoginController{HTTPClient: httpClient}
	lc.InitRoutes(r)
	return lc
}

// InitRoutes ...
func (lc LoginController) InitRoutes(r *gin.Engine) {
	r.GET(`/`, middleware.EL(), lc.Home)
}

// Home ...
func (lc LoginController) Home(c *gin.Context) {
	// c.HTML(http.StatusOK, "index.html", gin.H{})
	c.HTML(http.StatusOK, "index.html", nil)
}
