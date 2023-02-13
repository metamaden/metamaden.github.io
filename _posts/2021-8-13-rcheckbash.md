---
layout: post
title: "Code Shorts: Run R package checks with a shell script"
excerpt: How can we more efficiently run R package build using bash?
modified: 2021/8/13, 12:00:00
tags: [programming, bash, shell, sh, R, developers, Bioconductor, CRAN]
comments: true
category: blog
---

<img src="https://raw.githubusercontent.com/metamaden/metamaden.github.io/master/_posts/media/ai_short1.JPG"  width="800" height="400">

In Code Shorts, I describe code usages which I find quirky, interesting, and/or useful. I'll focus on implementations that could help to improve the working efficiency and quality of life for researchers and coders alike, all while keeping things brief.

While checks are crucial to R package development, running them from command line can quickly become repetitive. I've written a shell script, [`rpackagecheck.sh`](https://gist.github.com/metamaden/14f6b5717e2934c118ffa9edfa45e765), that runs the standard steps to checking an R package. The script uses `R CMD ...` to install, build, and check packages with any combination of the three major check types.  This script can help discourage accidents, such as running check on a directory rather than a `.tar.gz` file, and ultimately expedite your development workflow.

# R package checks

If you've submitted an R package on CRAN or Bioconductor, you're familiar with the barrage of checks an R package needs to pass before it can be published. The three most common check types are supported in the `rpackagecheck.sh` script detailed below. These are the standard `R CMD CHECK`, Bioconductor's `R CMD BiocCheck`, and CRAN's `R CMD CHECK --as-cran`. For specific check requirements, consult the developer documentation for the repo to which you're submitting (e.g. [here](https://cran.r-project.org/web/packages/submission_checklist.html) for CRAN and [here](https://www.bioconductor.org/developers/package-guidelines/#checkingenv) for Bioconductor).

# Running the script

When you're ready to run one or several checks on your package, you can simply run the script from command line. 

With the script [`rpackagecheck.sh`](https://gist.github.com/metamaden/14f6b5717e2934c118ffa9edfa45e765) in the current directory and the package folder located at `path/to/package`, run:

```
sh rpackagecheck.sh -p path/to/package  -v -r
```

This example would install the package, build it with vignettes per the `-v` flag, then run `R CMD CHECK` per the `-r` flag.

# The full script

The full [`rpackagecheck.sh`](https://gist.github.com/metamaden/14f6b5717e2934c118ffa9edfa45e765) script is as follows:

```
#!/usr/bin/env sh

# Author: Sean Maden
#
# Script to install, build, and check R packages during development. Can perform
# one of 3 check types (R CHECK with and without '--as-cran', or BiocCheck).
# 
# Flags:
# -v : Build vignettes (otherwise use `... --no-build-vignettes`)
# -r : Run `R CMD CHECK ...`
# -b : Run `R BiocCheck ...`
# -c : Run CRAN check (e.g. `R CMD CHECK --as-cran ...`)
# 
# Returns:
# Builds the package, generates tarball containing the built binaries and check
# logs.

#------------
# parse flags
#------------
# initialize flag variables
packagepath=
buildvignettes=0
rcheck=0
bioccheck=0
crancheck=0

# parse provided flags
while getopts vrbchp: name; do
    case "$name" in
        'v')    buildvignettes=1;;
        'r')    rcheck=1;;
        'b')    bioccheck=1;;
        'c')    crancheck=1;;
        'p')    packagepath=$OPTARG;;
        \?)     echo "Invalid option provided: -$OPTARG" >&2;;
    esac
done

#-------------------------
# package setup for checks
#-------------------------
# check package path existence
if [ ! -d "$packagepath" ]; then
    echo 'ERROR: invalid package path provided'
    exit 1
fi

# prep the package
R CMD INSTALL $packagepath

# parse buildvignettes flag
if [ $buildvignettes == 0 ]; then
    echo 'Skipping vignette builds...'
    R CMD BUILD $packagepath --no-build-vignettes
else
    echo 'Building vignettes...'
    R CMD BUILD $packagepath
fi

# prep the tar path
packagename=$(basename $packagepath)
# get the version from description text
vers=$(sed '2q;d' $packagepath'/DESCRIPTION') 
vf=${vers:9}
tarpath=$packagename'_'$vf'.tar.gz' # detect the tar file

#---------------------
# run specified checks
#---------------------
if [ ! $rcheck == 0 ]; then
    echo 'Running `R CMD CHECK`...'
    R CMD CHECK $tarpath
fi
if [ ! $bioccheck == 0 ]; then
    echo 'Running `R CMD BiocCheck`...'
    R CMD BiocCheck $tarpath
fi
if [ ! $crancheck == 0 ]; then
    echo 'Running `R CMD CHECK --as-cran`...'
    R CMD CHECK --as-cran $tarpath
fi
```

# Script anatomy

The script handles several flags described in its docstrings:

```
# Flags:
# -v : Build vignettes (otherwise use `... --no-build-vignettes`)
# -r : Run `R CMD CHECK ...`
# -b : Run `R BiocCheck ...`
# -c : Run CRAN check (e.g. `R CMD CHECK --as-cran ...`)
```

Each flag, such as `-v`, has a corresponding variable, such as `buildvignettes`. The default variable values are first defined as:

```
packagepath=
buildvignettes=0
rcheck=0
bioccheck=0
crancheck=0
```

Variables `buildvignettes`, `rcheck`, `bioccheck`, and `crancheck` act like switches, where a value of 0 = off and 1 = on. The unassigned `packagepath` variable will store the user-provided path to the package's directory.

The flag variables will update according to the user-provided flags. Variable update is handled with `getopts` as shown:

```
while getopts vrbchp: name; do
    case "$name" in
        'v')    buildvignettes=1;;
        'r')    rcheck=1;;
        'b')    bioccheck=1;;
        'c')    crancheck=1;;
        'p')    packagepath=$OPTARG;;
        \?)     echo "Invalid option provided: -$OPTARG" >&2;;
    esac
done
```

The package path is provided after `-p`, e.g. `-p ./my/package/path`. This is achieved by setting `packagepath=$OPTARG`, where `$OPTARG` is the user-provided path to an R package. Providing any additional flags sets the corresponding variables to 1. This ensures the corresponding step is run rather than skipped. 

For example, providing a flag `-v -r -b` will build the vignettes (per `-v`), run `R CMD CHECK` (per `-r`), then finally run `R CMD BiocCheck` (per `-b`). Providing the flags in the format `-vrb` is also supported.

Before installation, the existence of the provided package path is checked in an if/then statement:

```
if [ ! -d "$packagepath" ]; then
    echo 'ERROR: invalid package path provided'
    exit 1
fi
```

If the path is valid, the script proceeds to install and build the package:

```
R CMD INSTALL $packagepath
if [ $buildvignettes -gt 0 ]; then
    R CMD BUILD $packagepath
else
    R CMD BUILD $packagepath --no-build-vignettes
fi
```

If the `-v` flag was provided, the build includes any vignettes. I included this parameter because I prefer to hold off on building any vignettes until the rest of the package successfully passes checks. This is because vignette builds can take awhile, and errors from vignette builds frequently reflect issues with the package code.

Building the package produces a `tar.gz`-compressed file. This file has a predictable file name structure, which the script automatically produces as shown:

```
# prep the tar path
packagename=$(basename $packagepath)
# get the version from description text
vers=$(sed '2q;d' $packagepath'/DESCRIPTION') 
vf=${vers:9}
tarpath=$packagename'_'$vf'.tar.gz' # detect the tar file
```

With `sed`, the package version is stripped from the DESCRIPTION file in the package directory and used to make the new file name. For instance, if the package name was "newpackage" and the version was "1.0.0", the new file name would be `newpackage_1.0.0.tar.gz`.

Finally, run anywhere from 0 to 3 total checks on the new package file using `R CMD ...`:

```
if [ ! $rcheck -gt 0 ]; then
    R CMD CHECK $tarpath
fi
if [ ! $bioccheck -gt 0 ]; then
    R CMD BiocCheck $tarpath
fi
if [ ! $crancheck -gt 0 ]; then
    R CMD CHECK --as-cran $tarpath
fi
```

The results are printed to the console and stored in subdirectories of a new directory with the `.Rcheck` extension.

# Conclusions

This post described the [`rpackagecheck.sh`](https://gist.github.com/metamaden/14f6b5717e2934c118ffa9edfa45e765) shell script, including how to run it from command line and how each part of the script works. Some background about the types of R package checks developers frequently use was also provided. Implementing a repetetive task in a script can save you time and help you to avoid errors, leaving more mental overhead to focus on package development.
