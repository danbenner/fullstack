package controllers

import (
	"fullstack/src/go/pkg/helper"
	"fullstack/src/go/services"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// OAuthController ...
type OAuthController struct {
	HTTPClient services.HTTPClient
	JWT        helper.JWT
	SSO        SingleSignOn
}

// SingleSignOn ...
type SingleSignOn struct {
	BaseAPIURL   string
	RedirectPath string
	AuthURL      string
	TokenURL     string
	ClientID     string
	ClientSecret string
}

// InitializeSSO ...
func (oc OAuthController) InitializeSSO(sso *SingleSignOn) {
	sso.BaseAPIURL = os.Getenv(`BASE_API_URL`)
	sso.RedirectPath = `oauth/redirect`
	sso.AuthURL = os.Getenv(`SSO_AUTH_URL`)
	sso.TokenURL = os.Getenv(`SSO_TOKEN_URL`)
	sso.ClientID = os.Getenv(`SSO_CLIENTID`)
	sso.ClientSecret = os.Getenv(`SSO_CLIENTSECRET`)
	log.Printf("SSO initialized...\n")
}

// NewOAuthController ...
func NewOAuthController(httpClient services.HTTPClient, r *gin.Engine) OAuthController {
	oc := OAuthController{HTTPClient: httpClient}
	oc.InitializeSSO(&oc.SSO)
	oc.InitRoutes(r)
	return oc
}

// InitRoutes ...
func (oc OAuthController) InitRoutes(r *gin.Engine) {
	r.GET(`/oauth/redirect`, oc.HandleOauth)
}

// HandleOauth ...
func (oc OAuthController) HandleOauth(c *gin.Context) {
	// ----------------------------------- PARSE CODE ----------------------------------- //
	code, err := helper.GetSingleFormValue(c.Request, `code`)
	if err != nil {
		log.Printf("ERROR: Failed to retrieve 'code'; 'Key value not present': \n\tMSG: %v\n", err.Error())
		c.JSON(http.StatusInternalServerError, "ERROR: Failed to retrieve 'code'; 'Key value not present': MSG: "+err.Error())
		return
	}
	// ---------------------------------- REQUEST TOKEN --------------------------------- //
	urlKeyValuePairs := map[string]string{
		"client_id":     oc.SSO.ClientID,
		"client_secret": oc.SSO.ClientSecret,
		"grant_type":    `authorization_code`,
		"code":          code,
		"redirect_uri":  oc.SSO.BaseAPIURL + oc.SSO.RedirectPath,
	}
	res, err := oc.HTTPClient.PostForm(oc.SSO.TokenURL, helper.SetURLValues(urlKeyValuePairs))
	if err != nil {
		log.Printf("ERROR: Handle Oauth httpClient failed to Do(request); \n\tMSG: %v\n\tURL.Values: %v\n", err.Error(), urlKeyValuePairs)
		c.JSON(http.StatusInternalServerError, "ERROR: Handle Oauth httpClient failed to Do(request); "+err.Error())
		return
	} else if res.StatusCode != 200 {
		defer res.Body.Close()
		response, _ := helper.UnmarshallHTTPResponseBody(res.Body)
		log.Printf("ERROR: Response.StatusCode from TOKEN POST: %v\n\tResponse.Body: %v\n", res.StatusCode, response)
		c.JSON(res.StatusCode, response)
		return
	}
	// --------------------------------- DECODE RESPONSE -------------------------------- //
	errToken := oc.JWT.RetrieveToken(res.Body, &oc.JWT)
	if errToken != nil {
		c.SetCookie(`token`, errToken.Error(), 7700, ``, ``, false, true)
		c.SetCookie(`userID`, "error", 100, ``, ``, false, false)
		c.Writer.Header().Set(`Location`, `/`)
		c.Writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	errParseToken := oc.JWT.ParseToken(&oc.JWT)
	if errParseToken != nil {
		c.SetCookie(`token`, errParseToken.Error(), 7700, ``, ``, false, true)
		c.SetCookie(`userID`, "error", 100, ``, ``, false, false)
		c.Writer.Header().Set(`Location`, `/`)
		c.Writer.WriteHeader(http.StatusFound)
		return
	}
	// ----------------------------------- STORE TOKEN ---------------------------------- //
	c.SetCookie(`token`, oc.JWT.Token.AccessToken["access_token"].(string), oc.JWT.Payload.EXP, ``, ``, false, true)
	c.SetCookie(`userID`, oc.JWT.Payload.SUB, oc.JWT.Payload.EXP, ``, ``, false, false)
	// --------------------------------------- LDAP ------------------------------------- //
	// matches, err := ldapapi.CustomLDAPAPISearch(oc.JWT.Payload.SUB)
	// if err != nil {
	// 	c.AbortWithStatus(http.StatusForbidden)
	// 	return
	// } else if len(matches) > 0 {
	// 	c.Writer.Header().Set(`Location`, `/`)
	// 	c.Writer.WriteHeader(http.StatusFound)
	// }
	c.Writer.Header().Set(`Location`, `/`)
	c.Writer.WriteHeader(http.StatusFound)
}
