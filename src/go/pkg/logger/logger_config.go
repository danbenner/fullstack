package logger

import (
	"context"
	"net/http"
	"os"

	uuid "github.com/satori/go.uuid"
	"github.com/sirupsen/logrus"
)

// ReqIDType underlying type of string used as a type for the context's key value
type ReqIDType string

const (
	appName = "fullstack"
)

var log *logrus.Entry

// ReqIDKey the key value used to retrieve the reuest id value from the context
var ReqIDKey = ReqIDType("requestId")

var stdFields map[string]interface{}

func init() {
	env := os.Getenv(`ENV`)
	if env != "LOCAL" {
		logrus.SetFormatter(&logrus.JSONFormatter{})
	}
	logrus.SetReportCaller(true)
	hn, err := os.Hostname()
	if err != nil {
		hn = "localhost"
	}
	stdFields = map[string]interface{}{
		"hostname": hn,
		"pid":      os.Getpid(),
		"app":      appName,
	}
	log = logrus.WithFields(stdFields)
	if env == `DEVELOPMENT` || env == `TEST` {
		if os.Getenv(`TRACE_LEVEL`) == `debug` {
			log.Logger.SetLevel(logrus.DebugLevel)
		}
		log.Logger.SetLevel(logrus.DebugLevel) //Setting debug level in dev and test un-conditionally
	}
}

// WithContext ...
func WithContext(ctx map[string]interface{}) LogEntry {
	return log.WithFields(logrus.Fields(ctx)).WithFields(logrus.Fields(stdFields))
}

func genReqID() (requestID string) {
	requestID = "default"
	id, err := uuid.NewV4()
	if err == nil {
		requestID = id.String()
	} else {
		log.Warnf("uuid.NewV4() failed with %s\n", err)
	}
	return

}

func getReqID(ctx context.Context) (requestID string) {
	requestID = "default"
	val, ok := ctx.Value(ReqIDKey).(string)
	if ok {
		requestID = val
	}
	return
}

// GetLog returns logrus.Entry
func GetLog(requestor ...interface{}) *logrus.Entry {
	if len(requestor) == 0 {
		return log
	}
	switch requestor[0].(type) {
	case *http.Request:
		var ctxReqID, hdrReqID, reqID string
		request := requestor[0].(*http.Request)
		reqCtx := request.Context()
		ctxReqID = getReqID(reqCtx)
		if ctxReqID == "default" {
			hdrReqID = request.Header.Get("request-id")
		}
		if ctxReqID == "default" && hdrReqID == "" {
			reqID = genReqID()
		}
		return log.WithField("requestId", reqID)
	case context.Context:
		ctx := requestor[0].(context.Context)
		return log.WithField("requestId", getReqID(ctx))
	case string:
		return log.WithField("requestId", requestor[0].(string))
	default:
		return log
	}
}

// GetReqID returns request Id from the input (context.Context or *http.Request)
func GetReqID(requestor interface{}) (requestID string) {
	var ctx context.Context
	switch requestor.(type) {
	case *http.Request:
		request := requestor.(*http.Request)
		ctx = request.Context()
		return getReqID(ctx)
	case context.Context:
		ctx := requestor.(context.Context)
		return getReqID(ctx)
	default:
		return "default"
	}
}
