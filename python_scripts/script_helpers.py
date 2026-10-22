DEFAULT_DATE = "261013"
DEFAULT_SET_ID = "rad"

def process_str(s):
    return '"' + s.replace("\"","\\\"") + '"'

def process_num(n):
    return n

def process_boolean(s):
    return s.lower()

def process_multi_line_str(s):
    return '"' + s.replace("\n","\\n").replace("\"","\\\"") + '"'

def process_array(array_str):
    s = ','.join((f'"{s}"' for s in array_str.split(", ")))
    return "[]" if len(array_str) == 0 else f"[{s}]"

def process_object(obj_str):
    s = ','.join(f'"{k}":"{v}"' for k,v in json.loads(obj_str).items())
    return f"{{{s}}}"
