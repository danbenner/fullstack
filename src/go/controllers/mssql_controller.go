package controllers

import (
	"database/sql"
	"fmt"
	"fullstack/src/go/middleware"
	"fullstack/src/go/services"
	"log"
	"net/http"
	"os"
	"strings"

	// needed for driver
	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gin-gonic/gin"
)

const sqlErrorRows = " (ERROR, CREATEDBY)"

// MssqlDB ...
type MssqlDB struct {
	Session  *sql.DB
	Server   string
	DB       string
	Table    string
	User     string
	Password string
	Port     string
}

type sqlError struct {
	Error     string `json:"error"`
	CreatedBy string `json:"createdBy"`
}

// MSSQLDB ...
var MSSQLDB MssqlDB

// MssqlController ...
type MssqlController struct {
	HTTPClient services.HTTPClient
	Err        sqlError
}

// InitializeMSSQL ... Create URL, Open connection, Ping
// NOTE: need to test, vs open ONLY when using
func (mc MssqlController) InitializeMSSQL() {
	MSSQLDB.Server = os.Getenv(`MSSQL_SERVER`)
	MSSQLDB.DB = os.Getenv(`MSSQL_DATABASE`)
	MSSQLDB.Table = os.Getenv(`MSSQL_TABLE`)
	MSSQLDB.User = os.Getenv(`MSSQL_USER`)
	MSSQLDB.Password = os.Getenv(`MSSQL_PASSWORD`)
	dataSourceName := fmt.Sprintf("server=%s;database=%s;user id=%s;password=%s",
		MSSQLDB.Server, MSSQLDB.DB, MSSQLDB.User, MSSQLDB.Password)
	var err error
	MSSQLDB.Session, err = sql.Open("mssql", dataSourceName)
	// NOTE: Unsure if this should be fatal?
	if err != nil {
		log.Fatal(fmt.Sprintf("ERROR: sql.Open() failed %v", err.Error()))
		return
	}
	e := MSSQLDB.Session.Ping()
	if e != nil {
		log.Printf("ERROR: Failed to ping MSSQL Server: %v\n", e.Error())
		return
	}
	log.Printf("MSSQL Initialized; Session Created...\n")
}

// NewMssqlController ...
func NewMssqlController(httpClient services.HTTPClient, r *gin.Engine) MssqlController {
	mc := MssqlController{HTTPClient: httpClient}
	mc.InitializeMSSQL()
	mc.InitRoutes(r)
	return mc
}

// InitRoutes ...
func (mc MssqlController) InitRoutes(r *gin.Engine) {
	r.GET(`/SQLtest`, mc.TestSQL)
	r.POST(`/PostError`, middleware.EL(), mc.WriteError)
}

// WriteError ... Bind POST Context to struct, Exec SQL statement
func (mc MssqlController) WriteError(c *gin.Context) {
	// the context body contains a reward, copy to controller.Err
	if err := c.BindJSON(&mc.Err); err != nil {
		log.Printf("ERROR: WriteError: Failed to BindJSON: %v\n", err.Error())
		return
	}
	// convert struct values into Mssql INSERT statement values as a string
	vals := getInsertValues(&mc.Err)
	// using 'vals' generate complete Mssql statement as string
	stmt := generateSQLstatement("INSERT", MSSQLDB.Table, sqlErrorRows, vals)
	// execute 'stmt' string
	_, err := MSSQLDB.Session.Exec(stmt)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		log.Printf("ERROR: Failed to WriteError: %v\n", err.Error())
		return
	}
	c.Status(http.StatusOK)
	log.Printf("Successful sqlError: %v\n", mc.Err)
}

// ... INSERT INTO
func generateSQLstatement(cmd string, table string, rows string, values string) (statement string) {
	switch strings.ToUpper(cmd) {
	case `INSERT`:
		statement = "INSERT INTO " + table + rows + values
	default:
		//
	}
	return statement
}

// - SQL-like "VALUES(parameters) string"
// 	- NOTE: each value TYPE specifies whether or not to include single-quotes around variable with Formatting
func getInsertValues(r *sqlError) (values string) {
	values = fmt.Sprintf(
		" VALUES ('%s','%s')",
		r.Error,
		r.CreatedBy)
	return values

}

// TestSQL ...
func (mc MssqlController) TestSQL(c *gin.Context) {
	var sqlversion string
	rows, err := MSSQLDB.Session.Query("select @@version")
	if err != nil {
		c.Writer.WriteHeader(500)
		c.Writer.WriteString("An error occurred while processing your request")
	} else {
		c.Header("Content-Type", "application/json")
		c.Writer.WriteHeader(200)
		c.Writer.WriteString("\n\t")
		c.Request.ParseForm()
		c.Writer.WriteString(c.Request.URL.Path)
		c.Writer.WriteString(c.Request.URL.Scheme)
		c.Writer.WriteString("\n\n")
		for rows.Next() {
			err := rows.Scan(&sqlversion)
			if err != nil {
				c.Writer.WriteString("ERROR: SQLtest failed getting sqlversion: " + err.Error())
			}
			c.Writer.WriteString(sqlversion)
		}
	}
}
