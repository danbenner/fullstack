package main

import (
	"fmt"
	"fullstack/src/go/config"
	"fullstack/src/go/controllers"
	"fullstack/src/go/middleware"
	"fullstack/src/go/services"
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func init() {
	Env := os.Getenv(`ENV`)
	fmt.Printf("ENV: %v\n", Env)
	if Env == `DEBUG` {
		config.RelativePath = os.Getenv(`WORKROOT`) // .vscode/launch.json
		config.Port = `8081`
	} else if strings.ToUpper(Env) == `LOCAL` {
		config.RelativePath = `dist`
		config.Port = `8081`
	} else {
		config.RelativePath = "./"
		if config.Port == `` {
			config.Port = os.Getenv(`PORT`)
		} else {
			fmt.Printf("Your Port has run amuck...:)")
		}
	}
	log.Printf("Basic Configuration Retrieved...\n")
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(CORS())
	router.Static(`/assets`, config.RelativePath+`/assets/`)              // NOTE: this route are unsafe/unsecure
	router.LoadHTMLFiles(config.RelativePath + `/assets/html/index.html`) // very valuable function
	router.Use(middleware.SetUserStatus())
	// ------------------------- ROUTES -------------------------- //
	addServices(router)
	// ------------------ RUNNING -----------------//
	fmt.Printf("Router Running on Port:%v\n", config.Port)
	router.Run(`:` + config.Port)
}

func addServices(r *gin.Engine) {
	httpClient := services.NewClient()

	controllers.NewHealthController(httpClient, r)
	controllers.NewLoginController(httpClient, r)
	controllers.NewOAuthController(httpClient, r)
	controllers.NewMongoController(httpClient, r)
	controllers.NewMssqlController(httpClient, r)
}

// CORS ...
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("mode", "no-cors")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
