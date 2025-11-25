import { IndicesCreateRequest } from "@opensearch-project/opensearch/api/types";

const index:IndicesCreateRequest['body'] = {
    mappings: {
        properties: {
            id: {type: "keyword"},
            name: {type: "text", analyzer: "name_analyzer"},
            state: {type: "keyword", null_value: "planned"},
            tag: {type: "keyword"},
            owner: {type: "keyword"},
            plannedStartDate: {type: "date"},
            priority: {type: "integer"},
            createdAt: {type: "date"},
            updatedAt: {type: "date"}
        }
    },
    settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
        analysis: {
            filter: {
                preserve_ascii_folding: {
                    type: "asciifolding",
                    preserve_original: true
                }
            },
            analyzer: {
                name_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: ["lowercase", "trim", "preserve_ascii_folding"]
                }
            }
        }
    }
}

export default index;
