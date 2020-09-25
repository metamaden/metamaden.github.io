---
---
layout: post
title: Mushroom Edibility With Data Science and Machine Learning: My ML Final Project
excerpt: Can machine learning tell us which mushrooms are safe to eat?
modified: 2018/12/25, 12:00:00
tags: [machine_learning, artificial_intelligence, keras, R, Python, e1071, randomForest, algorithm, computer_science, biology, computation]
comments: true
category: blog
---

This past Fall quarter, I completed my first college-level machine learning course. 
I hope you will enjoy this discussion of my final project report, entitled, if you can forgive the pun, _Shrooms and Tunes_. 
You can find the report in its entirety in my [machine learning repo](https://github.com/metamaden/machine-learning). 

My report analyzes the [UCI Mushrooms dataset](https://archive.ics.uci.edu/ml/datasets/mushroom). 
There are a lot of example analyses looking at this dataset over the years, including several fairly recent analyses 
(e.g. [here](https://rpubs.com/soumya2g/CUNY-Coursework), [here](http://inmachineswetrust.com/posts/mushroom-classification/), 
and [here](http://rstudio-pubs-static.s3.amazonaws.com/293253_357dc3b3d3de44c8896039a9985674d4.html)) that use similar 
strategies to mine. So consider my report a throwing of my hat into the ring. With this post, I want to take this 
opportunity to write at a high level about the process of conducting a data science experiment, including my reasoning 
about statistics and experimental design, how I interpret model predictive performances, and how I form a narrative 
around quantitative facts about the data. Before I continue though, here is a quick disclaimer from my report's discussion, 
facetiously titled "What Can I Eat?":

>"Vitally, the UCI Mushroom dataset is simulated based on real species descriptions, and it should not be considered a 
substitute for real field data from biological specimens! As such, conclusions from this analysis should in no way be 
used to inform any actual decisions on what type of mushrooms it is ok to consume!"

I won't pretend at being a mycologist here, or a mushroom expert of any ilk, though I do possess some background in 
field biology. In fact, it's this background that compells me to highlight the synthetic nature of the data I'm using. 
Perhaps my findings could be used to test new hypotheses about real specimens. But my ultimate intent is not to get 
pedantic about mushrooms. I rather hope to demonstrate how to think quantitatively, skeptically, and empirically 
about an interesting data analysis problem. No more, and no less.

My experiment design tested models using one of three algorithm classes: 1. random forest; 2. support vector machines 
(SVM); or 3. neural networks. For this, I applied the R packages 
[randomForest](https://cran.r-project.org/web/packages/randomForest/index.html), 
[e1071](https://cran.r-project.org/web/packages/e1071/index.html), and 
[keras](https://cran.r-project.org/web/packages/keras/index.html), respectively, all of which I found to be supremely 
accessible and time-efficient. I may post a strictly-replicable markdown essay that recreates my report, 
with embedded code and annotations. For now, I will proceed to discuss my findings and thought process.

Before analysis, I needed to preprocess the mushrooms data. It takes the form of typical field data, 
including 25 categorical variable types pertaining to various aspects of mushroom species phenotype 
(e.g. stalk surface, odor type, spore print color, etc.). Since most machine learning algorithms 
require numeric inputs, I recoded variables using one-hot encoding, or "OHE." This approach is used to 
transform a factor of more than two levels into some number of new binary numeric variables, equal to 
the number of levels in the original variable. For instance, if we pretend a variable "spot color" 
can take possible states of "black", "brown", or "none", OHE would re-code this variable into three 
new ones: 1. black spot color; 2. brown spot color; or 3. no spot color, where each new variable can 
be either 0 (no/False, etc.) or 1 (yes/True, etc.). OHE has the caveat of greatly increasing dimensionality, 
which is typically not desirable because it increases risk of model overfitting. That is, the data becomes 
too granualar, and real observable effects are too divided amongst too-similar and/or confounded variables. 
Here, the initial 25 categorical variables were converted to 112 binary numeric variables. While a 
substantial dimensionality increase, 112 is actually not a huge number of variables in and of itself, 
especially considering other types of data often tackled with machine learning, and the increased 
risk of overfitting is thus somewhat mitigated here. 

After recoding the entire dataset, I divided it equally and randomly into training and validation subsets, 
conserving variable state frequency (0/"no" or 1/"yes") and instance category frequency ("edible" or "poisonous") 
as much as possible between subsets.

![varimp_rforest.jpg](https://raw.githubusercontent.com/metamaden/metamaden.github.io/master/_posts/media/varimp_rforest.jpg) 
**Figure 1.** Relative variable importance in random forests model test (N = 5,000 trees).

I then fitted and tested each model on the preprocessed data. It was surprising to observe substantial 
discrepancy in model predictive performance across the different algorithms. Testing various 
hyperparameter sets with random forest or SVM, I observed uniformly high performance, especially 
when compared to virtually every neural network model I tested. There were slight performance differences 
suggesting increased performance with either increased tree count (random forest, with ntrees from 10 to 5,000) 
or a variable weight filter (SVM, retaining the top 50% highest-weighted variables and using a linear kernel). 
These high-performing models converged on distinct important variable sets (Figure 1, above, and Figure 2, below). 
But with neural networks, overall performance was generally erratic across 50 epochs of training, and I had to 
consider evidence of overfitting (e.g. decline in performance on validation data over training epochs, Figure 3, below), 
to determine which network hyperparameter set was most promising. 

There could be several reasons for this overall subpar neural network performance. Neural networks may 
generally be less suited than alternative algorithms for training using binary data. It's also possible 
that I didn't encounter the optimum network topology or strategy for these particular data, despite 
testing over 10 different kinds varying hidden layer quantity, nodes per hidden layer, and/or batch size. 
Finally, it's possible neural networks are more susceptible to noisiness in the data. This point relates 
to an interesting property of the UCI Mushrooms data, that the poisonous instances combine species of 
unknown edibility with known poisonous species, presumably to help increase the effective size of the dataset. 
Unfortunately, I could not find a form of the dataset designating instances of unknown edibility, and so 
could not diagnose the impact of unknown species instances directly.

![varimp_svm.jpg](https://raw.githubusercontent.com/metamaden/metamaden.github.io/master/_posts/media/varimp_svm.jpg)
**Figure 2.** Relative variable weight/importance of top-weighted variables in support vector machine (SVM) 
model test (using linear kernel and top-50% variable weight filter).

Too often in science, researchers operate as though there is an unspoken one-test-type limit for any given 
analysis or experiment. Coincidentally, the favored test type tends to coincide with whatever test(s) the 
researcher happens to be most familiar with. This inadvertent myopia can mean an important point gets overlooked: 
recurrence of a conclusion from different tests using fundamentally distinct algorithm types (and, subsequently, 
distinct assumptions, conditions, and limitations), can itself provide a form of consilience. That is, a 
convergence of knowledge from multiple disparate angles. This point can be leveraged to limit false positive 
or misleading results, with the caveat that any test introduces its own chances for error. Here, I was interested 
in the extent of consilience across the three types of algorithms for identifying important mushroom traits that 
predict edibility.

![nnepoch.jpg](https://raw.githubusercontent.com/metamaden/metamaden.github.io/master/_posts/media/nnepoch.jpg)
**Figure 3.** Performance of neural network over 50 epochs (with 1 hidden layer, 5 hidden nodes per layer, and 
batch size equal to training set sample size).

For SVM and random forest algorithms, relative variable importance is readily quantified and has intelligible 
meaning (Figures 1 and 2, above). Considering relative variable performance across models of each of these classes, 
there were a handful of variables pertaining to odor and color pattern that were recurrently important (e.g. 
foul creosote odor predict poisonous types, none, anise, and almond predict edible types, etc). According to 
the dataset's documentation, these variables were also among those considered important form rules derived from 
prior analyses over the years (e.g. one rule states "odor NOT (almond, anise or none)" predicts poisonous cases 
with high accuracy, which is consistent with my findings). 

To determine relative variable importance in neural networks, I had to get creative. By design, neural networks 
allow for mixing of input node effects, sometimes in complex and counter-intuitive ways. This precludes straightforward 
quantification of individual variable importance for network prediction, or output layer activation. But in a slightly 
counter-intuitive way, we can indirectly get at a variable's importance... by assessing the impact of its very absence! 
We should expect a greater negative impact to model performance when an important variable, or subset of important 
variables, is excluded, as opposed to when random variables are excluded. So I considered a handful of the most 
recurrent and putatively important variables identified from random forest and SVM models (Table 1, below). 
Working with the best-performing neural network model, assessed the deleterious impact to model performance after 
effectively excluding the important variable set by manually changing all instance values to 0. I also excluded a 
random subset of the same number of variables from the data and reassessed model performance in a separate test. 
Sure enough, exclusion of the putative important variables showed a more deleterious effect on model performance 
(e.g. accuracy decreased from 90% to 73%, versus 83%), providing further support of these variable's importance 
for determining mushroom edibility.

**Table 1.** Top Mushroom Edibility Traits and Species Examples
![shroomtable.jpg](https://raw.githubusercontent.com/metamaden/metamaden.github.io/master/_posts/media/shroomtable.jpg)


More often than not, a satisfying investigation turns up and motivates many more interesting questions than it answers, 
and this analysis was no exception. The problem of isolating physical traits that determine mushroom edibility presents 
some interesting opportunities for data science and machine learning. In my report, I explored one approach using 
synthesized specimen data and a range of different models and algorithm types (see Table 1 for several of the most 
important species traits for determining edibility, according to my analyses). I applied a binarized edibility 
conditional (e.g. "eidble" or "poisonous"), but if we consult an actual [field guide](http://www.svims.ca/council/Lepiot.htm), 
we readily find greater natural variety and ambiguity of "edibility" states observed among wild mushrooms. Notably, some 
species are just potentially poisonous (e.g. "potentially deadly—has amanitins"), and some even have conflicting evidence 
(e.g. "'edible' in some European field guides; a look-alike may be lethal."). This highlights an important implicit assumption, 
which is that edibility traits coincide with species traits. Given the above, there is good reason to suspect species-identifying 
traits don't actually correlate well with edibility-determining traits, at least not for all wild North American mushrooms. 
Stepping back, we can consider other potentially useful analyses. It would be fascinating, for instance, to train a visual 
algorithm to extract important image features from photos of real mushrooms in the field, as they might appear to a real-life 
field mycologist or mushroom hunter, and to then compare extracted visual traits to visual traits found to differentiate 
mushroom species here (e.g. "green spore color", "pendant ring type", "broad gill size", etc.). 
