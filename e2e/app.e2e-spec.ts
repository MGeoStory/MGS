import { Ud3Page } from './app.po';

describe('ud3 App', function() {
  let page: Ud3Page;

  beforeEach(() => {
    page = new Ud3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
