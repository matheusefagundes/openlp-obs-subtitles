window.OpenLP = {
  loadService: function (event) {
    $.getJSON(
      "/api/service/list",
      function (data, status) {
        OpenLP.nextSong = "";
        $("#notes").html("");
        for (idx in data.results.items) {
          idx = parseInt(idx, 10);
          if (data.results.items[idx]["selected"]) {
            $("#notes").html(data.results.items[idx]["notes"].replace(/\n/g, "<br />"));
            if (data.results.items.length > idx + 1) {
              OpenLP.nextSong = data.results.items[idx + 1]["title"];
            }
            break;
          }
        }
        OpenLP.updateSlide();
      }
    );
  },
  loadSlides: function (event) {
    $.getJSON(
      "/api/controller/live/text",
      function (data, status) {
        OpenLP.currentSlides = data.results.slides;
        OpenLP.currentSlide = 0;
        OpenLP.currentTags = Array();
        var div = $("#verseorder");
        div.html("");
        var tag = "";
        var tags = 0;
        var lastChange = 0;
        $.each(data.results.slides, function (idx, slide) {
          var prevtag = tag;
          tag = slide["tag"];
          if (tag != prevtag) {
            // If the tag has changed, add new one to the list
            lastChange = idx;
            tags = tags + 1;
            div.append("&nbsp;<span>");
            $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
          }
          else {
            if ((slide["text"] == data.results.slides[lastChange]["text"]) &&
              (data.results.slides.length >= idx + (idx - lastChange))) {
              // If the tag hasn't changed, check to see if the same verse
              // has been repeated consecutively. Note the verse may have been
              // split over several slides, so search through. If so, repeat the tag.
              var match = true;
              for (var idx2 = 0; idx2 < idx - lastChange; idx2++) {
                if (data.results.slides[lastChange + idx2]["text"] != data.results.slides[idx + idx2]["text"]) {
                  match = false;
                  break;
                }
              }
              if (match) {
                lastChange = idx;
                tags = tags + 1;
                div.append("&nbsp;<span>");
                $("#verseorder span").last().attr("id", "tag" + tags).text(tag);
              }
            }
          }
          OpenLP.currentTags[idx] = tags;
          if (slide["selected"])
            OpenLP.currentSlide = idx;
        })
        OpenLP.loadService();
      }
    );
  },

  updateSlide: function () {
    var slide = OpenLP.currentSlides[OpenLP.currentSlide];
    var text = '<span>' + slide.text.replace(/\n/g, " / ") + '</span>';
    // var text = slide.text.replace(/\n/g, " <p> ");
    $("#currentslide").html(text);
  },

  verifyVisibility: function (data) {
    const isVisible = !data.results.blank && !data.results.display;
    if (OpenLP.isVisible !== isVisible) {
      OpenLP.isVisible = isVisible;
      if (OpenLP.isVisible) {
        $("#container").removeClass('hidden');
      } else {
        $("#container").addClass('hidden');
      }
    }
  },

  pollServer: function () {
    $.getJSON("/api/poll", function (data, status) {
      if (OpenLP.currentItem != data.results.item || OpenLP.currentService != data.results.service) {
        OpenLP.currentItem = data.results.item;
        OpenLP.currentService = data.results.service;
        OpenLP.loadSlides();
      }
      else if (OpenLP.currentSlide != data.results.slide) {
        OpenLP.currentSlide = parseInt(data.results.slide, 10);
        OpenLP.updateSlide();
      }
      OpenLP.verifyVisibility(data);
    }
    );
  }

}

$.ajaxSetup({ cache: false });
setInterval("OpenLP.pollServer();", 500);
OpenLP.pollServer();
