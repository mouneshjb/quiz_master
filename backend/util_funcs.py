# current_user.roles is a list of objects i.e. [<role 1>, <role 2> ...]
# we can use the below utility function to get the roles list for the current user who is stored in the session data
from jinja2 import Template

def roles_list(roles):
    role_list = []
    for role in roles:
        role_list.append(role.name)
    return role_list

def format_report(html_template, data):
    with open(html_template) as file:
        template = Template(file.read())
        return template.render(data = data)