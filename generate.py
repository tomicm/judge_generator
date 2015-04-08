#!/usr/bin/python

from spreadsheet_parser.data_manager import DataManager
from jinja2 import Environment, FileSystemLoader

manager = DataManager()
contests = manager.get_contests()

contest_groups = sorted(set([
    (contest.short_name, contest.full_name) for contest in contests
]))

# generiranje HTML-a
env = Environment(loader=FileSystemLoader('templates'))

contest_list_template = env.get_template('contest_list.html')
task_list_template = env.get_template('task_list.html')

f = open('public_html/tasks.html', 'w')
f.write(contest_list_template.render(contests=contest_groups).encode('utf-8'))
f.close()

for (contest_group_name, contest_group_full_name) in contest_groups:
    contest_group = filter(lambda ct: ct.short_name == contest_group_name, contests)

    f = open('public_html/contests/%s.html' % contest_group_name, 'w')
    f.write(task_list_template.render(
                name=contest_group_full_name, 
                contest_list=contest_group, 
                manager=manager
                ).encode('utf-8'))
    f.close()
