(function() {
  return {
    doneLoading: false,
    requests: {
      fetchTicket: function(){
        return {
          url: '/api/v2/tickets/'+this.ticket().id()+'.json'
        }
      },

      fetchTicketAudits: function(){
        return {
          url: '/api/v2/tickets/'+this.ticket().id()+'/audits.json'
        }
      }
    },

    events: {
      'app.activated'           : 'initialize',
      'fetchTicket.done'        : 'fetchTicketDone',
      'fetchTicketAudits.done'  : 'fetchTicketAuditsDone'
    },

    initialize: function() {
      if (this.doneLoading)
        return;

      this.ajax('fetchTicket');
      this.doneLoading = true;
    },

    fetchTicketDone: function(data){
      if(data.ticket.via.channel == 'email')
        return this.ajax('fetchTicketAudits');
    },

    fetchTicketAuditsDone: function(data){
      this.switchTo('button', {
        audit_id: data.audits[0].id
      })
    }
  };

}());
