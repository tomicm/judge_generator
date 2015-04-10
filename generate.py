#!/usr/bin/python

from spreadsheet_parser.data_manager import DataManager
from jinja2 import Environment, FileSystemLoader

manager = DataManager()
tasks = manager.get_tasks()

task_tree = {}

unique_id = 0

for task in tasks:
    levels = task.contests_key.split('-')
    node = task_tree
    for level in levels:
        node = node.setdefault(level, (unique_id, {}))[1]
        unique_id = unique_id+1
    node.setdefault('-tasks', []).append(task)

env = Environment(loader=FileSystemLoader('templates'))
task_list_template = env.get_template('task_list.html')

f = open('public_html/tasks.html', 'w')
f.write(task_list_template.render(task_tree=task_tree).encode('utf8'))
f.close()
