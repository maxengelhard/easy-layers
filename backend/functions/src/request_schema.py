request_schema={
    "type":"object",
    "properties": {
        "body": {
            "type": "object",
            "properties": {
                "library": {
                    "type": "string",
                    "pattern": "^[a-zA-Z0-9_.-]*$"
                },
                "version": {
                    "type": "string",
                    "pattern": "^[a-zA-Z0-9_.-]*$"
                }
            },
            "required": ["library"]
        }
    }
}