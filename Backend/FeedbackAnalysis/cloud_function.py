import functions_framework
import json
from google.cloud import language_v1 

@functions_framework.http
def hello_http(request):
    request_json = request.get_json(silent=True)
    request_args = request.args

    if request_json and 'comment' in request_json:
        comment = request_json['comment']
    elif request_args and 'comment' in request_args:
        comment = request_args['comment']
    else:
        return 'Please provide a comment for analysis.'

    client = language_v1.LanguageServiceClient()
    document = language_v1.Document(content=comment, type_=language_v1.Document.Type.PLAIN_TEXT)
    sentiment = client.analyze_sentiment(request={'document': document}).document_sentiment

    polarity = 'neutral'
    if sentiment.score > 0.25:
        polarity = 'positive'
    elif sentiment.score < -0.25:
        polarity = 'negative'

    response = {
        'comment': comment,
        'sentiment': polarity,
        'score': sentiment.score
    }

    return json.dumps(response)