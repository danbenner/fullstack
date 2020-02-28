package middleware

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

/* ----------------------------------------------------------------------- */

const isLoggedIn = `is_logged_in` // name of the key in the cookie

/* ----------------------------------------------------------------------- */

// SSO ...
type SSO struct {
	BaseAPIURL   string
	RedirectPath string
	AuthURL      string
	TokenURL     string
	ClientID     string
	ClientSecret string
}

func newSSO() SSO {
	return SSO{
		BaseAPIURL:   os.Getenv(`BASE_API_URL`),
		RedirectPath: `oauth/redirect`,
		AuthURL:      os.Getenv(`SSO_AUTH_URL`),
		TokenURL:     os.Getenv(`SSO_TOKEN_URL`),
		ClientID:     os.Getenv(`SSO_CLIENTID`),
		ClientSecret: os.Getenv(`SSO_CLIENTSECRET`),
	}
}

/* ----------------------------------------------------------------------- */

// SetUserStatus ... set Cookie `key`: `is_logged_in` to true/false
// NOTE: May want to perform JWT function here
func SetUserStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		// NOTE: Cookie name might be an env variable
		if token, err := c.Cookie(`token`); err == nil || token != `` {
			c.Set(isLoggedIn, true)
		} else {
			c.Set(isLoggedIn, false)
		}
	}
}

/* ----------------------------------------------------------------------- */

// EnsureLoggedIn ...
//	- if `key`: isLoggedIn exists, set `loggedIn` = `value`
//	- if `value` != `true`, redirect to SSO, while providing destination `dest`
func EnsureLoggedIn() gin.HandlerFunc {
	SSO := newSSO()
	return func(c *gin.Context) {
		loggedInInterface, exists := c.Get(isLoggedIn)
		loggedIn := false
		if exists && loggedInInterface != nil {
			loggedIn = loggedInInterface.(bool)
		}
		if loggedIn {
			return
		}

		if strings.ToLower(os.Getenv("ENV")) == `local` || strings.ToLower(os.Getenv("ENV")) == `debug` {
			c.SetCookie(`token`, "LOCAL ENV", 10000, ``, ``, false, true)
			c.SetCookie(`userID`, os.Getenv("ENV"), 10000, ``, ``, false, false)
			c.Writer.Header().Set(`Location`, `/`)
			c.Writer.WriteHeader(http.StatusFound)
			return
			c.AbortWithStatus(http.StatusForbidden)
			return
		}
		// c.SetCookie(`redirectURL`, c.Request.URL.String(), 600, ``, ``, false, true)
		params := fmt.Sprintf(
			"scope=openid profile&client_id=%s&response_type=code&redirect_uri=%s%s",
			SSO.ClientID, SSO.BaseAPIURL, SSO.RedirectPath)
		uri := url.PathEscape(params)
		var redirectURL = SSO.AuthURL + uri
		c.Redirect(http.StatusTemporaryRedirect, redirectURL)
		return
	}
}

/* ----------------------------------------------------------------------- */

func fakeHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
	}
}

const forcedDebug = "off"

// debugMode ... Allows for Production Project to have debugging enabled
func debugMode() func() gin.HandlerFunc {
	if os.Getenv("DEBUG") == "on" || forcedDebug == "on" {
		return fakeHandler
	}
	return EnsureLoggedIn
}

// EL ... set to EnsureLoggedIn(), allows for testing routes
var EL = debugMode()
