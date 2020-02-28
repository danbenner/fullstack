package config

// Model is the model for configuration
var (
	Environment           string
	RelativePath          string
	Port                  string
	CaBundlePath          string
	RetryDelayMS          int
	RetryCount            int
	BasicAuthHash         string
	HTTPConnectionTimeout int
	HTTPResponseTimeout   int
)

const (
	ConnTimeoutMin = 2000
	ConnTimeoutMax = 5000
	ConnTimeoutDef = 2000
	RespTimeoutMin = 2000
	RespTimeoutMax = 5000
	RespTimeoutDef = 2000
)
