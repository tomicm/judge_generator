#!/usr/bin/python

from jinja2 import Environment, FileSystemLoader
from spreadsheet_parser.data_manager import DataManager
from directory_tree_builder.directory_manager import DirectoryManager
import sys, os
import itertools
import _settings


def _makedirs(path):
    try:
        os.makedirs(path)
    except OSError:
        if not os.path.isdir(path):
            raise

def renderToFile(fname, template, **kwargs):
    f = open(fname, 'w')
    f.write(template.render(**kwargs).encode('utf-8'))
    f.close()

if __name__ == '__main__':
    settings = _settings.SETTINGS
    env = Environment(loader=FileSystemLoader('templates'))

#   simple templates, just need settings
    simple_templates = [
#       ('template/path', 'where/to/render')
        ('html/index.html', 'index.html'),
        ('html/help.html', 'help.html'),
        ('html/about.html', 'about.html'),
        ('html/submit.html', 'submit.html'),
        ('html/status.html', 'status.html'),
        ('css/style.css', 'css/style.css'),
        ('js/submit.js', 'js/submit.js'),
        ('js/status.js', 'js/status.js'),
    ]

#   directories to make
    dirs = [
        'contests',
        'css',
        'js',
    ]

#   complex stuff
    contest_list_template = env.get_template('html/contest_list.html')
    contest_template = env.get_template('html/contest.html')

#   creating directories and downloading task statements
    basedir = sys.argv[1]

    _makedirs(basedir)

    for directory in dirs:
        _makedirs('%s/%s' % (basedir, directory))

    dir_manager = DirectoryManager(basedir)
    dir_manager.build_from_spreadsheet(True, False, settings['test'])

#   generating HTML
    data_manager = DataManager()
    dir_manager = DirectoryManager('.')

    contests = data_manager.get_contests()
    contest_tree = {}
    contest_years = {}

    for contest in contests:
        ct = contest_tree.setdefault(contest.short_name, {})
        ct.setdefault(contest.year, []).append(contest)
        ct = contest_years.setdefault(contest.short_name, [])
        ct.append(contest.year)

    renderToFile('%s/contests.html' % basedir, contest_list_template,
        settings=settings,
        data_manager=data_manager,
        contest_years=contest_years,
    )

    for name, years in contest_tree.iteritems():
        for year, rounds in years.iteritems():
            renderToFile(
                '%s/contests/%s_%s.html' % (basedir, name, year),
                contest_template,
                settings=settings,
                data_manager=data_manager,
                dir_manager=dir_manager,
                name=name,
                year=year,
                rounds=rounds
            )
    
    for (template_path, dest) in simple_templates:
        template = env.get_template(template_path)
        renderToFile('%s/%s' % (basedir, dest), template, settings=settings)
