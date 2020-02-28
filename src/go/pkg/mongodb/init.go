package mongodb

import (
	"context"
	"crypto/x509"
	"fullstack/src/go/pkg/logger"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoURL from local or retrieved from SplitPea
var (
	MongoURL    string
	MongoClient *mongo.Client
	DBNAME      = os.Getenv(`MDB_NAME`)
	DBTimeoutMs int
	log         = logger.GetLog()
)

// init ...
func init() {
	timeoutStr := os.Getenv("HTTP_CONNECTION_TIMEOUT_MS")
	if timeoutStr == "" {
		timeoutStr = "2000"
	}

	DBTimeoutMs, err := strconv.Atoi(timeoutStr)
	if err != nil {
		log.Errorf("Unable to convert timeoutStr to integer")
		DBTimeoutMs = 2000
	}
	getMongoURL()

	ctx, cancel := context.WithTimeout(
		context.Background(),
		time.Duration(DBTimeoutMs)*time.Millisecond)
	defer cancel()

	MongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(MongoURL))
	if err != nil {
		log.Fatalf("Error connecting to mongo: %v", err)
	}
}

func getMongoURL() {
	// local, development, test, production
	env := os.Getenv(`ENV`)

	if strings.ToLower(env) == `local` {
		if os.Getenv(`MDB_URL`) == `` {
			panic(`MDB_URL must be set when running in LOCAL mode.`)
		}
		MongoURL = "mongodb://" + os.Getenv(`MDB_URL`)
	} else {
		MongoURL = "mongodb://userID:server:PORT/admin?connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"
	}

}

// GetCertPool gets the configuration values for the api
func GetCertPool() *x509.CertPool {
	caBundlePath := os.Getenv("CA_BUNDLE_PATH")
	newCert := x509.NewCertPool()
	caCert, err := ioutil.ReadFile(caBundlePath)
	if err != nil {
		log.Errorf("Unable to load CA Bundle: %v", err)
	} else {
		if !newCert.AppendCertsFromPEM(caCert) {
			log.Errorf("Unable to add CA Bundle")
		}
	}
	return newCert
}
