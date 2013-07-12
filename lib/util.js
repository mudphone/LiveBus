_U = {
  // Defines the existence of something.
  // JavaScript has two values - null and undefined - that signify
  // nonexistence. Thus, this checks that its argument is neither.
  //   Functional JavaScript, p19
  existy: function (x) { 
    return x != null;
  }
}