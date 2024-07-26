#!/bin/bash

# Set environment variables
nifi_host="localhost:8443"
pg_name="nifi-flow"
clientId=$(openssl rand -hex 16 | tr "[:upper:]" "[:lower:]")
#set this to your nifi username and password
username=""
password="" 

# Function to handle errors
handle_error() {
  echo "Error: $1"
  exit 1
}

# Get the access token
get_access_token() {
  local username=$1
  local password=$2

  token=$(curl -s -k -X POST "https://$nifi_host/nifi-api/access/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$username&password=$password")

  if [ -z "$token" ]; then
    handle_error "Failed to obtain access token"
  fi
  echo "$token"
}

# Get access token
token=$(get_access_token "$username" "$password")

# Get the Root Process Group ID
root_pg_id=$(curl -s -k -H "Authorization: Bearer $token" -X GET "https://$nifi_host/nifi-api/flow/process-groups/root" | jq -r '.processGroupFlow.id')
if [ -z "$root_pg_id" ]; then
  handle_error "Failed to get Root Process Group ID"
fi
echo "Root Process Group ID: $root_pg_id"

# Check if the process group already exists
existing_pg_id=$(curl -s -k -H "Authorization: Bearer $token" -X GET "https://$nifi_host/nifi-api/flow/process-groups/$root_pg_id" | jq -r --arg pg_name "$pg_name" '.processGroupFlow.flow.processGroups[] | select(.component.name == $pg_name) | .component.id')
if [ -z "$existing_pg_id" ]; then
  # Create the process group
  create_pg_response=$(curl -s -k -H "Authorization: Bearer $token" -X POST "https://$nifi_host/nifi-api/process-groups/$root_pg_id/process-groups" \
    -H "Content-Type: application/json" \
    -d '{
      "revision": {
        "version": 0
      },
      "component": {
        "name": "'"$pg_name"'"
      }
    }')
  pg_id=$(echo $create_pg_response | jq -r '.id')
  if [ -z "$pg_id" ]; then
    echo "Create Process Group Response: $create_pg_response"
    handle_error "Failed to create Process Group"
  fi
  echo "Created Process Group ID: $pg_id"
else
  pg_id=$existing_pg_id
  echo "Existing Process Group ID: $pg_id"
fi

# Function to create a processor with properties
create_processor() {
  local processor_name=$1
  local processor_type=$2
  local pos_x=$3
  local pos_y=$4
  local properties=$5

  create_processor_response=$(curl -s -k -H "Authorization: Bearer $token" -X POST "https://$nifi_host/nifi-api/process-groups/$pg_id/processors" \
    -H "Content-Type: application/json" \
    -d '{
      "revision": {
        "version": 0
      },
      "component": {
        "type": "'"$processor_type"'",
        "name": "'"$processor_name"'",
        "position": {
          "x": '"$pos_x"',
          "y": '"$pos_y"'
        },
        "config": {
          "properties": '"$properties"'
        }
      }
    }')

  processor_id=$(echo $create_processor_response | jq -r '.id')
  if [ -z "$processor_id" ]; then
    echo "Create Processor Response: $create_processor_response"
    handle_error "Failed to create processor $processor_name"
  fi

  echo "$processor_name=$processor_id" >> processor_ids.sh
  echo "Created Processor ID: $processor_id"

}
kafka_properties=$(jq -n \
  --arg brokers "localhost:9092" \
  --arg topic "email_data" \
  --arg group_id "gmail_consumer_1437" \
  '{
    "bootstrap.servers": $brokers,
    "topic": $topic,
    "group.id": $group_id
  }')

  exec_stream_properties=$(jq -n \
  --arg dir "C:\Users\shafi\OneDrive\Desktop\nifi-scripts\extractor" \
  --arg path "C:\Users\shafi\OneDrive\Desktop\nifi-scripts\extractor\venv\Scripts\python.exe" \
  --arg args "email-parse.py" \
  '{ "Working Directory": $dir, "Command Path": $path, "Command Arguments": $args }')
  
update_attr_properties=$(jq -n \
  --arg key '${filename}' \
  --arg filename '${filename}.json' \
  '{ "merge.key": $key, "filename":$filename }')

  put_elasticsearch_properties=$(jq -n \
  --arg client_service "ElasticSearchClientServiceImpl" \
  --arg index "vector" \
  '{
    "Client Service": $client_service,
    "Index": $index
  }')

retry_flowfile_properties=$(jq -n \
  '{ }')

log_attribute_properties=$(jq -n \
  '{ }')


  echo "" > processor_ids.sh
create_processor "ConsumeKafka_2_6" "org.apache.nifi.processors.kafka.pubsub.ConsumeKafka_2_6" 100 100 "$kafka_properties"
create_processor "Emailparse" "org.apache.nifi.processors.standard.ExecuteStreamCommand" 100 300 "$exec_stream_properties"
create_processor "RetryFlowFile" "org.apache.nifi.processors.standard.RetryFlowFile" -400 300 "$retry_flowfile_properties"
create_processor "LogAttribute" "org.apache.nifi.processors.standard.LogAttribute" -400 500 "$log_attribute_properties"
create_processor "UpdateAttribute" "org.apache.nifi.processors.attributes.UpdateAttribute" 100 500 "$update_attr_properties"
create_processor "PutElasticsearchJson" "org.apache.nifi.processors.elasticsearch.PutElasticsearchJson" 100 700 "$put_elasticsearch_properties"
create_processor "RetryFlowFile2" "org.apache.nifi.processors.standard.RetryFlowFile" 500 700 "$retry_flowfile_properties"
create_processor "LogAttribute2" "org.apache.nifi.processors.standard.LogAttribute" 500 500 "$log_attribute_properties"
echo "Processors created successfully."

# Load processor IDs
source ./processor_ids.sh


# Function to create a connection between processors
create_connection() {
  local source_id=$1
  local source_relation=$2
  local dest_id=$3

  connection_id=$(curl -s -k -H "Authorization: Bearer $token" -X POST "https://${nifi_host}/nifi-api/process-groups/${pg_id}/connections" \
    -H "Content-Type: application/json" \
    -d '{
      "revision": {
        "clientId": "'"${clientId}"'",
        "version": 0
      },
      "component": {
        "name": "",
        "source": {
          "id": "'"${source_id}"'",
          "groupId": "'"${pg_id}"'",
          "type": "PROCESSOR"
        },
        "destination": {
          "id": "'"${dest_id}"'",
          "groupId": "'"${pg_id}"'",
          "type": "PROCESSOR"
        },
        "selectedRelationships": [
          "'"${source_relation}"'"
        ],
        "flowFileExpiration": "0 sec",
        "backPressureDataSizeThreshold": "1 GB",
        "backPressureObjectThreshold": 10000,
        "bends": [],
        "prioritizers": []
      }
    }' | jq -r '.id')

  if [ -z "$connection_id" ]; then
    handle_error "Failed to create connection from ${source_id} to ${dest_id} with relationship ${source_relation}"
  fi

  echo "Created Connection ID: $connection_id"
}


# Create connections with "success" relationship
create_connection "$ConsumeKafka_2_6" "success" "$Emailparse"
create_connection "$Emailparse" "output stream" "$UpdateAttribute"
create_connection "$UpdateAttribute" "success" "$PutElasticsearchJson"
create_connection "$RetryFlowFile" "retries_exceeded" "$LogAttribute"
create_connection "$Emailparse" "nonzero status" "$RetryFlowFile"
create_connection "$RetryFlowFile" "retry" "$Emailparse"
create_connection "$PutElasticsearchJson" "failure" "$RetryFlowFile2"
create_connection "$PutElasticsearchJson" "errors" "$RetryFlowFile2"
create_connection "$RetryFlowFile2" "retry" "$PutElasticsearchJson"
create_connection "$RetryFlowFile2" "retries_exceeded" "$LogAttribute2"
create_connection "$PutElasticsearchJson" "retry" "$PutElasticsearchJson"

echo "NiFi flow connections created successfully."


update_processor_auto_terminate() {
  local processor_id=$1
  local relationships=$2

  # Fetch the latest revision information
  processor_info=$(curl -s -k -H "Authorization: Bearer $token" -X GET "https://${nifi_host}/nifi-api/processors/${processor_id}")
  revision=$(echo $processor_info | jq -r '.revision.version')
  processor_config=$(echo $processor_info | jq '.component.config')

  # Update the config to auto-terminate the specified relationships
  updated_config=$(echo $processor_config | jq --argjson rels "$relationships" '. + {autoTerminatedRelationships: $rels}')

  curl -s -k -X PUT "https://${nifi_host}/nifi-api/processors/${processor_id}" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{
      "revision": {
        "version": '"${revision}"',
        "clientId": "'"${clientId}"'"
      },
      "component": {
        "id": "'"${processor_id}"'",
        "config": '"${updated_config}"'
      }
    }'
}

# Update to auto-terminate the specified relationships
update_processor_auto_terminate "$Emailparse" '["original"]'
update_processor_auto_terminate "$LogAttribute" '["success"]'
update_processor_auto_terminate "$LogAttribute2" '["success"]'
update_processor_auto_terminate "$PutElasticsearchJson" '["successful"]'
update_processor_auto_terminate "$PutElasticsearchJson" '["original"]'

echo "Auto-terminate relationships updated successfully."