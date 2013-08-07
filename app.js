(function() {
  return {
    doneLoading: false,
    requests: {
      fetchTicket: function(){
        return {
          url: '/api/v2/tickets/'+this.ticket().id()+'.json',
          proxy_v2: true
        };
      },

      fetchTicketAudits: function(){
        return {
          url: '/api/v2/tickets/'+this.ticket().id()+'/audits.json',
          proxy_v2: true
        };
      },

      fetchOriginalEmail: function(audit_id){
        return {
          url: '/audits/%@/email.eml'.fmt(audit_id),
          dataType: 'text'
        };
      }
    },

    events: {
      'app.activated'           : 'initialize',
      'fetchTicket.done'        : 'fetchTicketDone',
      'fetchTicketAudits.done'  : 'fetchTicketAuditsDone',
      'fetchOriginalEmail.done' : 'fetchOriginalEmailDone',
      'click .reply'            : 'replaceRequester'
    },

    initialize: function() {
      if (this.doneLoading)
        return;

      this.ajax('fetchTicket');
      this.doneLoading = true;
    },

    replaceRequester: function() {
      this.$('.spinner').show();
      this.ajax('fetchOriginalEmail', this.$('input[name=audit_id]').val())
    },

    fetchTicketDone: function(data){
      if(data.ticket.via.channel == 'email')
        return this.ajax('fetchTicketAudits');
    },

    fetchTicketAuditsDone: function(data){
      this.switchTo('button', {
        audit_id: data.audits[0].id
      });
    },

    fetchOriginalEmailDone: function(data){
      var re = new RegExp(/From: (.*) <(.*)>/),
        res = re.exec(data);

      if (res)
        this.ticket().requester({ name: res[1], email: res[2]})
      this.$('.spinner').hide();
    }
  };

}());
