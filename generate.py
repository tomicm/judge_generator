#!/usr/bin/python

from spreadsheet_parser.data_manager import DataManager
from directory_tree_builder.directory_manager import DirectoryManager
from jinja2 import Environment, FileSystemLoader
import itertools

data_manager = DataManager()
dir_manager = DirectoryManager('.')
contests = data_manager.get_contests()

contest_tree = {}

for contest in contests:
    ct = contest_tree.setdefault(contest.short_name, {})
    ct.setdefault(contest.year, []).append(contest)

env = Environment(loader=FileSystemLoader('templates'))
contest_list_template = env.get_template('contest_list.html')
contest_template = env.get_template('contest.html')

f = open('public_html/contests.html', 'w')
f.write(
    contest_list_template.render(
        data_manager=data_manager, 
        contest_tree=contest_tree
    ).encode('utf8')
)
f.close()

for name, years in contest_tree.iteritems():
    for year, rounds in years.iteritems():
        f = open('public_html/contests/%s_%s.html' % (name, year), 'w')
        f.write(contest_template.render(
            data_manager=data_manager,
            dir_manager=dir_manager,
            name=name,
            year=year,
            rounds=rounds
        ).encode('utf8'))
        f.close()
