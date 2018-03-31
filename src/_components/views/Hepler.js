export function changePage(self, item) {
    self.setState({
        page: {
            number: item - 1
        }
    }, self.load);
}

export function setData (self, data) {
    self.setState({
        page: data.page,
        data: data._embedded
    });
}

export function loadData (self, service, ELEMENTS_PER_PAGE) {
    service
        .findAll(self.state.page.number, ELEMENTS_PER_PAGE)
        .then((res) => setData(self, res));
}